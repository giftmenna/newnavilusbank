import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Use the environment variable for the connection string
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Set connection pool parameters to handle concurrent requests
const sql = postgres(process.env.DATABASE_URL, { 
  max: 10, // Maximum number of connections in the pool
  idle_timeout: 20, // Connections are automatically closed after this many seconds of inactivity
  connect_timeout: 10, // Timeout in seconds for connection attempts
});

console.log('Database connection established');
export const db = drizzle(sql);
