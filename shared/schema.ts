import { pgTable, text, serial, numeric, timestamp, pgEnum, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Defining enums
export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);
export const userStatusEnum = pgEnum('user_status', ['active', 'inactive', 'deleted']);
export const transactionTypeEnum = pgEnum('transaction_type', ['deposit', 'withdrawal', 'transfer']);

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  pin: text("pin").notNull(),
  email: text("email").notNull().unique(),
  balance: numeric("balance", { precision: 10, scale: 2 }).notNull().default("0"),
  role: userRoleEnum("role").notNull().default('user'),
  status: userStatusEnum("status").notNull().default('active'),
  last_login: timestamp("last_login"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  auth_token: text("auth_token"),
  avatar: text("avatar"),
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  user_id: serial("user_id").references(() => users.id).notNull(),
  type: transactionTypeEnum("type").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  recipient_info: json("recipient_info"),
  timestamp: timestamp("timestamp").notNull(),
  created_by: serial("created_by").references(() => users.id),
  receipt: text("receipt"),
  memo: text("memo"),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, created_at: true, last_login: true, auth_token: true })
  .extend({
    password: z.string().min(6, "Password must be at least 6 characters"),
    pin: z.string().length(4, "PIN must be exactly 4 digits").regex(/^[0-9]{4}$/, "PIN must contain only digits"),
    email: z.string().email("Invalid email address"),
    balance: z.coerce.number().optional(),
  });

export const loginUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const insertTransactionSchema = createInsertSchema(transactions)
  .omit({ id: true })
  .extend({
    amount: z.coerce.number().positive("Amount must be positive"),
    recipient_info: z.any().optional(),
    timestamp: z.coerce.date(),
  });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
