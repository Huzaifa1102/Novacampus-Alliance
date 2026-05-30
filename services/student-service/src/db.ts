import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,               // maximum 10 concurrent connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// Test the connection on startup
pool.on('connect', () => {
  console.log('Connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('PostgreSQL connection error:', err);
  process.exit(1);
});

// Helper: run a query with campus RLS applied
export async function query(
  text: string,
  params?: unknown[],
  campusId?: string
) {
  const client = await pool.connect();
  try {
    // Set the campus session variable for Row Level Security
    if (campusId) {
      await client.query(
        `SET app.current_campus_id = '${campusId}'`
      );
    }
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}