import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

pool.on('error', (err) => {
  console.error('PostgreSQL connection error:', err);
  process.exit(1);
});

export async function testConnection(): Promise<void> {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('Connected to PostgreSQL');
  } catch (err) {
    console.error('Failed to connect to PostgreSQL:', err);
    console.error('DATABASE_URL:', process.env.DATABASE_URL);
    process.exit(1);
  }
}

export async function query(
  text: string,
  params?: unknown[],
  campusId?: string
) {
  const client = await pool.connect();
  try {
    if (campusId) {
      await client.query(`SET app.current_campus_id = '${campusId}'`);
    }
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}