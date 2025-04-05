import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Fix for connection issues - use postgres-js instead of neon
const sql = postgres(process.env.DATABASE_URL, { max: 10 });
export const db = drizzle(sql);
