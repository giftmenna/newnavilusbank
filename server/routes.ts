import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { hashPassword } from "./auth";
import { insertTransactionSchema, type InsertTransaction } from "@shared/schema";
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
      // Parse and validate the transaction data
      const validatedData = insertTransactionSchema.parse(req.body);
      
      // Create the proper transaction data object with all required fields
      const transactionData: InsertTransaction = {
        user_id: validatedData.user_id,
        type: validatedData.type,
        amount: validatedData.amount,
        timestamp: validatedData.timestamp || new Date(),
        created_by: req.user.id,
        recipient_info: validatedData.recipient_info || null,
        memo: validatedData.memo || "",
      };
      
      // Validate user exists
      const user = await storage.getUser(transactionData.user_id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Process transaction based on type
      const userBalance = parseFloat(user.balance.toString());
      const amount = transactionData.amount;
      let newBalance = userBalance;
      
      if (transactionData.type === "deposit") {
        newBalance = userBalance + amount;
      } else if (transactionData.type === "withdrawal" || transactionData.type === "transfer") {
        newBalance = userBalance - amount;
        
        if (newBalance < 0) {
          return res.status(400).json({ message: "Insufficient funds" });
        }
      }
      
      // Update user balance and create transaction
      await storage.updateUserBalance(user.id, newBalance);
      const transaction = await storage.createTransaction(transactionData);
      
      res.status(201).json({
        transaction,
        message: `Transaction created successfully. User balance updated to ${newBalance}.`
      });
    } catch (error) {
      console.error("Admin transaction error:", error);
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
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Error fetching transactions" });
    }
  });
  
  // Delete transaction (admin only)
  app.delete("/api/admin/transactions/:id", authenticateJWT, async (req, res) => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const { id } = req.params;
    
    try {
      const success = await storage.deleteTransaction(parseInt(id));
      
      if (success) {
        res.status(200).json({ message: "Transaction deleted successfully" });
      } else {
        res.status(404).json({ message: "Transaction not found" });
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      res.status(500).json({ message: "Error deleting transaction" });
    }
  });

  // User Routes
  
  // Get user transactions
  app.get("/api/transactions", authenticateJWT, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      console.log("Fetching transactions for user ID:", req.user.id);
      const transactions = await storage.getUserTransactions(req.user.id);
      console.log("Transactions fetched:", transactions.length);
      res.json(transactions);
    } catch (error) {
      console.error("Error in /api/transactions:", error);
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
      
      console.log("Transfer request body:", { 
        amount, 
        recipientInfo: typeof recipientInfo, 
        transferType, 
        pin: pin ? "***" : undefined, 
        memo 
      });
      
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
      
      // Generate a random 7-digit transaction ID (as string format)
      const transactionId = Math.floor(1000000 + Math.random() * 9000000).toString();
      
      // Parse recipient info if it's a string
      let parsedRecipientInfo = recipientInfo;
      if (typeof recipientInfo === 'string') {
        try {
          parsedRecipientInfo = JSON.parse(recipientInfo);
        } catch (e) {
          console.error("Error parsing recipient info:", e);
          // If parsing fails, use as-is
        }
      }
      
      // Create transaction
      const transaction = await storage.createTransaction({
        user_id: req.user.id,
        type: "transfer",
        amount: numAmount,
        recipient_info: parsedRecipientInfo,
        timestamp: new Date(),
        memo: memo || "",
        transaction_id: transactionId, // Add the transaction_id
      });
      
      console.log("Transaction created:", transaction);
      
      res.status(201).json({
        transaction
      });
    } catch (error) {
      console.error("Transfer error:", error);
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

  // Database connection test route
  app.get("/api/db-connection", async (req, res) => {
    try {
      // Test the database connection by running a simple query
      const result = await storage.testDatabaseConnection();
      
      // Create a masked database URL for display
      const dbUrl = process.env.DATABASE_URL || "";
      const maskedUrl = maskConnectionString(dbUrl);
      
      res.json({
        status: "connected",
        message: "Database connection is active",
        connection: {
          masked_url: maskedUrl,
          provider: "Neon PostgreSQL",
          poolSize: 10
        },
        test_result: result
      });
    } catch (error) {
      console.error("Database connection test failed:", error);
      res.status(500).json({
        status: "error",
        message: "Database connection test failed",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to mask sensitive parts of the connection string
function maskConnectionString(connectionString: string): string {
  if (!connectionString) return "Not configured";
  
  try {
    // Create a URL object from the connection string
    // This handles postgresql:// style connection strings
    const url = new URL(connectionString);
    
    // Mask the password
    if (url.password) {
      url.password = "****";
    }
    
    // Return the masked URL
    return url.toString();
  } catch (e) {
    // If parsing fails (e.g., for non-URL format connection strings)
    // do a basic replacement using regex
    return connectionString
      .replace(/:[^:@/]+@/, ":****@") // Replace password
      .replace(/password=[^&]+/, "password=****"); // Replace password in query params
  }
}
