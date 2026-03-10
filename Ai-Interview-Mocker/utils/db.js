// /utils/db.js
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';  // Ensure you have the correct schema file path

// Initialize Neon database client using the connection URL from environment variables
const sql = neon(process.env.NEXT_PUBLIC_DRIZZLE_DB_URL);

// Configure Drizzle ORM with the Neon client and schema
export const db = drizzle({
  client: sql,
  schema: schema  // Make sure schema is correct
});
