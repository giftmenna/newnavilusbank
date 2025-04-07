import * as dotenv from "dotenv";
dotenv.config();

import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { setupVite, serveStatic, log } from "./vite";
import { setupDatabase } from "./setup-db";
import { registerRoutes } from "./routes";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Disable caching in development
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });
    next();
  });
}

// Increase JSON payload limit to 5MB to handle larger base64 avatar uploads
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: false, limit: "5mb" }));

// Enhanced request logging
app.use((req, res, next) => {
  const start = Date.now();
  const originalJson = res.json;
  let responseBody: any;

  res.json = function (body) {
    responseBody = body;
    return originalJson.call(this, body);
  };

  res.on("finish", () => {
    log(`${req.method} ${req.path} - ${res.statusCode} [${Date.now() - start}ms]`);
    if (responseBody) {
      console.debug("Response:", JSON.stringify(responseBody, null, 2));
    }
  });

  next();
});

(async () => {
  await setupDatabase();
  const server = createServer(app);
  await registerRoutes(app);

  // Error handling
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
      error: process.env.NODE_ENV !== "production" ? err.message : "Internal Error",
    });
  });

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const PORT = process.env.PORT || 6001;
  server.listen(PORT, () => {
    log(`Server running on port ${PORT}`);
    console.log("✅ Environment:", {
      NODE_ENV: process.env.NODE_ENV,
      DB_CONNECTED: !!process.env.NEON_DATABASE_URL,
    });
  });
})();
