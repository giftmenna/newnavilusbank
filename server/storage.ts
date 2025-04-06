import { 
  User, 
  InsertUser, 
  users, 
  transactions, 
  Transaction, 
  InsertTransaction 
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Storage interface
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser & { auth_token?: string | null }): Promise<User>;
  updateUserStatus(id: number, status: 'active' | 'inactive' | 'deleted'): Promise<User | undefined>;
  updateUserBalance(id: number, balance: number): Promise<User | undefined>;
  updateLastLogin(id: number): Promise<void>;
  updateAuthToken(id: number, token: string | null): Promise<void>;
  updateUserAvatar(id: number, avatar: string): Promise<User>;
  updateUserThemePreference(id: number, theme: 'light' | 'dark' | 'system'): Promise<User>;
  
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getUserTransactions(userId: number): Promise<Transaction[]>;
  getAllTransactions(filters?: { 
    userId?: number; 
    startDate?: Date; 
    endDate?: Date; 
  }): Promise<Transaction[]>;
  deleteTransaction(id: number): Promise<boolean>;
  
  sessionStore: session.Store;
}

// Database implementation
export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).where(
      and(
        eq(users.status, 'active'),
        eq(users.role, 'user')
      )
    );
  }

  async createUser(insertUser: InsertUser & { auth_token?: string | null }): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserStatus(id: number, status: 'active' | 'inactive' | 'deleted'): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ status })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async updateUserBalance(id: number, balance: number): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ balance })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async updateLastLogin(id: number): Promise<void> {
    await db
      .update(users)
      .set({ last_login: new Date() })
      .where(eq(users.id, id));
  }

  async updateAuthToken(id: number, token: string | null): Promise<void> {
    await db
      .update(users)
      .set({ auth_token: token })
      .where(eq(users.id, id));
  }

  async updateUserAvatar(id: number, avatar: string): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ avatar })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async updateUserThemePreference(id: number, theme: 'light' | 'dark' | 'system'): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ theme_preference: theme })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values(insertTransaction)
      .returning();
    return transaction;
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.user_id, userId))
      .orderBy(desc(transactions.timestamp));
  }

  async getAllTransactions(filters?: { 
    userId?: number; 
    startDate?: Date; 
    endDate?: Date; 
  }): Promise<Transaction[]> {
    let query = db.select().from(transactions);
    
    if (filters) {
      if (filters.userId) {
        query = query.where(eq(transactions.user_id, filters.userId));
      }
      
      if (filters.startDate) {
        query = query.where(gte(transactions.timestamp, filters.startDate));
      }
      
      if (filters.endDate) {
        query = query.where(lte(transactions.timestamp, filters.endDate));
      }
    }
    
    return await query.orderBy(desc(transactions.timestamp));
  }
  
  async deleteTransaction(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(transactions)
        .where(eq(transactions.id, id))
        .returning({ id: transactions.id });
      
      return result.length > 0;
    } catch (error) {
      console.error("Error deleting transaction:", error);
      return false;
    }
  }
}

export const storage = new DatabaseStorage();
