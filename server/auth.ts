import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User, insertUserSchema, loginUserSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface User extends User {}
  }
}

const scryptAsync = promisify(scrypt);
const JWT_SECRET = process.env.JWT_SECRET || "nivalus_bank_super_secret_key";
const TOKEN_EXPIRY = '7d';

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "nivalus_session_secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Invalid username or password" });
        }
        
        if (user.status !== 'active') {
          return done(null, false, { message: "Account is not active" });
        }
        
        if (!(await comparePasswords(password, user.password))) {
          return done(null, false, { message: "Invalid username or password" });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Registration endpoint
  app.post("/api/register", async (req, res, next) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Hash the password and PIN
      userData.password = await hashPassword(userData.password);
      
      // Generate and store auth token
      const token = jwt.sign({ username: userData.username }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
      
      const user = await storage.createUser({
        ...userData,
        auth_token: token
      });

      // Update last login time
      await storage.updateLastLogin(user.id);

      req.login(user, (err) => {
        if (err) return next(err);
        return res.status(201).json({
          ...user,
          password: undefined,
          pin: undefined,
          auth_token: token
        });
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      next(error);
    }
  });

  // Login endpoint
  app.post("/api/login", async (req, res, next) => {
    try {
      const loginData = loginUserSchema.parse(req.body);
      
      passport.authenticate("local", async (err: Error, user: User) => {
        if (err) return next(err);
        if (!user) {
          return res.status(401).json({ message: "Invalid username or password" });
        }

        if (user.status !== 'active') {
          return res.status(403).json({ message: "Account is not active" });
        }

        // Generate token and update in database
        const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
        await storage.updateAuthToken(user.id, token);
        await storage.updateLastLogin(user.id);

        req.login(user, (err) => {
          if (err) return next(err);
          return res.status(200).json({
            ...user,
            password: undefined,
            pin: undefined,
            auth_token: token
          });
        });
      })(req, res, next);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      next(error);
    }
  });

  // JWT Authentication middleware
  const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      
      if (!token) {
        // Fall back to session auth if no token
        return passport.authenticate("session", { session: false })(req, res, next);
      }
      
      // Verify token
      jwt.verify(token, JWT_SECRET, async (err, decoded: any) => {
        if (err) {
          return res.status(401).json({ message: "Invalid or expired token" });
        }
        
        // Get user by username from the JWT payload
        const user = await storage.getUserByUsername(decoded.username);
        if (!user || user.auth_token !== token || user.status !== 'active') {
          return res.status(401).json({ message: "Invalid session" });
        }
        
        req.user = user;
        next();
      });
    } catch (error) {
      next(error);
    }
  };

  // Logout endpoint
  app.post("/api/logout", authenticateJWT, async (req, res, next) => {
    try {
      if (req.user) {
        await storage.updateAuthToken(req.user.id, null);
      }
      
      req.logout((err) => {
        if (err) return next(err);
        res.sendStatus(200);
      });
    } catch (error) {
      next(error);
    }
  });

  // Get current user endpoint
  app.get("/api/user", authenticateJWT, (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    // Don't send sensitive information
    const user = { ...req.user };
    delete user.password;
    delete user.pin;
    
    res.json(user);
  });

  return { authenticateJWT };
}
