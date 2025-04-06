import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Use the Neon database URL if provided, otherwise fall back to the default DATABASE_URL
const connectionString = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("No database connection string found in environment variables");
}

// Set connection pool parameters to handle concurrent requests
const sql = postgres(connectionString, { 
  max: 10, // Maximum number of connections in the pool
  idle_timeout: 20, // Connections are automatically closed after this many seconds of inactivity
  connect_timeout: 10, // Timeout in seconds for connection attempts
  ssl: { rejectUnauthorized: false }, // Required for Neon database connections
});

console.log('Database connection established with Neon');
export const db = drizzle(sql);
