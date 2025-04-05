import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { hashPassword } from "./auth";
import { insertTransactionSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  const { authenticateJWT } = setupAuth(app);

  // Create default admin user if it doesn't exist
  try {
    const adminUser = await storage.getUserByUsername("admin");
    if (!adminUser) {
      await storage.createUser({
        username: "admin",
        password: await hashPassword("admin123"),
        pin: "0000",
        email: "admin@nivalusbank.com",
        role: "admin",
        status: "active",
      });
      console.log("Default admin user created");
    }
  } catch (error) {
    console.error("Error creating default admin user:", error);
  }

  // Admin Routes
  
  // Get all users (admin only)
  app.get("/api/admin/users", authenticateJWT, async (req, res) => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const users = await storage.getAllUsers();
    res.json(users);
  });

  // Create user (admin only)
  app.post("/api/admin/users", authenticateJWT, async (req, res) => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    try {
      const userData = req.body;
      
      // Check if user exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Hash the password
      userData.password = await hashPassword(userData.password);
      
      const user = await storage.createUser(userData);
      res.status(201).json({ ...user, password: undefined, pin: undefined });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Error creating user" });
    }
  });

  // Update user status (admin only)
  app.patch("/api/admin/users/:id/status", authenticateJWT, async (req, res) => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const { id } = req.params;
    const { status } = req.body;
    
    if (!["active", "inactive", "deleted"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    
    try {
      const user = await storage.updateUserStatus(parseInt(id), status);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ ...user, password: undefined, pin: undefined });
    } catch (error) {
      res.status(500).json({ message: "Error updating user status" });
    }
  });

  // Create transaction (admin only)
  app.post("/api/admin/transactions", authenticateJWT, async (req, res) => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      
      // Set the admin as creator
      transactionData.created_by = req.user.id;
      
      // Validate user exists
      const user = await storage.getUser(transactionData.user_id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Process transaction based on type
      let newBalance = user.balance;
      const amount = parseFloat(transactionData.amount.toString());
      
      if (transactionData.type === "deposit") {
        newBalance = parseFloat(user.balance.toString()) + amount;
      } else if (transactionData.type === "withdrawal" || transactionData.type === "transfer") {
        newBalance = parseFloat(user.balance.toString()) - amount;
        
        if (newBalance < 0) {
          return res.status(400).json({ message: "Insufficient funds" });
        }
      }
      
      // Update user balance and create transaction
      await storage.updateUserBalance(user.id, newBalance);
      const transaction = await storage.createTransaction(transactionData);
      
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Error creating transaction" });
    }
  });

  // Get all transactions (admin only)
  app.get("/api/admin/transactions", authenticateJWT, async (req, res) => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const { userId, startDate, endDate } = req.query;
    
    try {
      const transactions = await storage.getAllTransactions({
        userId: userId ? parseInt(userId as string) : undefined,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
      });
      
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching transactions" });
    }
  });

  // User Routes
  
  // Get user transactions
  app.get("/api/transactions", authenticateJWT, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const transactions = await storage.getUserTransactions(req.user.id);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching transactions" });
    }
  });

  // Create a transfer
  app.post("/api/transfer", authenticateJWT, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const { amount, recipientInfo, transferType, pin, memo } = req.body;
      
      if (!amount || !recipientInfo || !transferType || !pin) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const numAmount = parseFloat(amount);
      
      if (isNaN(numAmount) || numAmount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }
      
      // Verify PIN
      if (req.user.pin !== pin) {
        return res.status(400).json({ message: "Invalid PIN" });
      }
      
      // Check balance
      const userBalance = parseFloat(req.user.balance.toString());
      if (userBalance < numAmount) {
        return res.status(400).json({ message: "Insufficient funds" });
      }
      
      // Update balance
      const newBalance = userBalance - numAmount;
      await storage.updateUserBalance(req.user.id, newBalance);
      
      // Create transaction
      const transaction = await storage.createTransaction({
        user_id: req.user.id,
        type: "transfer",
        amount: numAmount,
        recipient_info: recipientInfo,
        timestamp: new Date(),
        memo: memo || "",
      });
      
      res.status(201).json({
        transaction,
        newBalance
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Error processing transfer" });
    }
  });

  // Update user avatar
  app.patch("/api/user/avatar", authenticateJWT, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const { avatar } = req.body;
      
      if (!avatar) {
        return res.status(400).json({ message: "Avatar is required" });
      }
      
      const updatedUser = await storage.updateUserAvatar(req.user.id, avatar);
      
      res.json({
        ...updatedUser,
        password: undefined,
        pin: undefined
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating avatar" });
    }
  });
  
  // Update user theme preference
  app.patch("/api/user/theme", authenticateJWT, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const { theme } = req.body;
      
      if (!theme || !['light', 'dark', 'system'].includes(theme)) {
        return res.status(400).json({ message: "Valid theme preference is required" });
      }
      
      const updatedUser = await storage.updateUserThemePreference(req.user.id, theme);
      
      res.json({
        ...updatedUser,
        password: undefined,
        pin: undefined
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating theme preference" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
