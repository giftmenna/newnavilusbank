import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Use the connection string directly since neon requires specific connection parameters
const connectionString = "postgresql://neondb_owner:npg_yGHiB4EDu6zg@ep-rapid-recipe-a2ya2vep-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require";

// Set connection pool parameters to handle concurrent requests
const sql = postgres(connectionString, { 
  max: 10, // Maximum number of connections in the pool
  idle_timeout: 20, // Connections are automatically closed after this many seconds of inactivity
  connect_timeout: 10, // Timeout in seconds for connection attempts
});

console.log('Database connection established');
export const db = drizzle(sql);
