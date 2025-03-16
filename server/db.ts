import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Optimized pool configuration for Neon serverless
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 3000, // Reduced from 5000
  max: 10, // Reduced from 20 to prevent connection overload
  idleTimeoutMillis: 10000, // Reduced from 30000 to release connections faster
  allowExitOnIdle: false // Changed to false to maintain minimal connections
});

// Enhanced error handling for the pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle database client', err);
  // Don't exit process, try to recover
  pool.connect().catch(connectErr => {
    console.error('Failed to recover pool connection:', connectErr);
    process.exit(-1);
  });
});

pool.on('connect', (client) => {
  client.on('error', (err) => {
    console.error('Database client error:', err);
  });
});

export const db = drizzle({ client: pool, schema });

// Initialize pool with better error handling
async function initializePool() {
  try {
    await pool.connect();
    console.log('Database connected successfully');
    const result = await pool.query('SELECT NOW()');
    console.log('Database query successful:', result.rows[0]);
  } catch (err) {
    console.error('Database connection error:', err);
    // Try to reconnect once before giving up
    try {
      await pool.connect();
      console.log('Database reconnection successful');
    } catch (retryErr) {
      console.error('Database reconnection failed:', retryErr);
      process.exit(-1);
    }
  }
}

initializePool();