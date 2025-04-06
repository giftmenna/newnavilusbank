import { db } from './db';
import { users, transactions, insertUserSchema } from "@shared/schema";
import { hashPassword } from "./auth";
import { sql } from 'drizzle-orm';

// Function to create tables if they don't exist
export async function setupDatabase() {
  try {
    // Create users table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL PRIMARY KEY,
        "username" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "pin" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "balance" TEXT DEFAULT '0.00',
        "role" TEXT DEFAULT 'user',
        "status" TEXT DEFAULT 'active',
        "last_login" TIMESTAMP,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "auth_token" TEXT,
        "avatar" TEXT,
        "theme_preference" TEXT DEFAULT 'system'
      );
    `);

    // Create transactions table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "transactions" (
        "id" SERIAL PRIMARY KEY,
        "transaction_id" TEXT,
        "user_id" INTEGER NOT NULL,
        "type" TEXT NOT NULL,
        "amount" TEXT NOT NULL,
        "recipient_info" JSONB,
        "timestamp" TIMESTAMP DEFAULT NOW(),
        "created_by" INTEGER,
        "receipt" TEXT,
        "memo" TEXT
      );
    `);

    // Check if admin user exists
    const adminUser = await db.select().from(users).where(sql`${users.username} = 'admin'`);

    // Create admin user if it doesn't exist
    if (!adminUser || adminUser.length === 0) {
      const hashedPassword = await hashPassword("admin123");

      await db.insert(users).values({
        username: "admin",
        password: hashedPassword,
        pin: "0000",
        email: "admin@nivalusbank.com",
        balance: "0.00",
        role: "admin",
        status: "active",
        theme_preference: "dark"
      });

      console.log("Default admin user created");
    }

    return true;
  } catch (error) {
    console.error("Error setting up database:", error);
    return false;
  }
}