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

// Add error handling for the pool
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
  max: 20,
  idleTimeoutMillis: 30000,
  allowExitOnIdle: true
});

// Add connection error handling
pool.on('error', (err) => {
  console.error('Unexpected error on idle database client', err);
  process.exit(-1);
});

export const db = drizzle({ client: pool, schema });

// Test the connection and log the result
pool.connect()
  .then(() => {
    console.log('Database connected successfully');
    // Test query to verify connection
    return pool.query('SELECT NOW()');
  })
  .then(result => {
    console.log('Database query successful:', result.rows[0]);
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(-1);
  });