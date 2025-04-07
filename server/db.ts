// server/db.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../shared/schema";
import 'dotenv/config';

// 1. Get connection string
const connectionString = process.env.NEON_DATABASE_URL;

if (!connectionString) {
  console.error('❌ Missing NEON_DATABASE_URL in .env file');
  console.error('Create a .env file with:');
  console.error('NEON_DATABASE_URL=postgres://user:pass@ep-name-123456.us-east-2.aws.neon.tech/dbname?sslmode=require');
  process.exit(1);
}

// 2. Create connection
const sql = postgres(connectionString, {
  ssl: 'require'
});

// 3. Test connection immediately
(async () => {
  try {
    const result = await sql`SELECT version()`;
    console.log('✅ Database connected:', result[0].version);
  } catch (err) {
    console.error('❌ Database connection failed:', err instanceof Error ? err.message : err);
    process.exit(1);
  }
})();

// 4. Export drizzle instance
export const db = drizzle(sql, { schema });
export default db;