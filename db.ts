import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { CONFIG } from './config';

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;
neonConfig.useSecureWebSocket = true; // Enable secure WebSocket
neonConfig.pipelineConnect = true; // Enable pipeline for better performance

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Optimized pool configuration for better performance
export const pool = new Pool({ 
  connectionString: CONFIG.DATABASE_URL,
  connectionTimeoutMillis: 10000, // Increased timeout
  max: 10, // Increased pool size for better concurrency
  idleTimeoutMillis: 30000, // Increased idle timeout
  allowExitOnIdle: true,
  ssl: {
    rejectUnauthorized: true,
    require: true
  }
});

// Initialize Drizzle with the pool
export const db = drizzle(pool, { schema });

// Initialize pool with better error handling and connection management
async function initializePool() {
  // Don't exit process on errors in development mode
  const handleError = (err) => {
    console.error('Database error:', err);
    if (process.env.NODE_ENV === 'production') {
      process.exit(-1);
    }
  };

  // Add event listeners for pool errors - but don't crash the app in development
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    // Don't exit in development to allow for recovery
    if (process.env.NODE_ENV === 'production') {
      process.exit(-1);
    }
  });

  let retries = 3;
  let connected = false;

  while (retries > 0 && !connected) {
    try {
      const client = await pool.connect();
      console.log('Database connected successfully');
      
      // Test query with timeout
      const queryPromise = client.query('SELECT NOW()');
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), 5000)
      );
      
      const result = await Promise.race([queryPromise, timeoutPromise]);
      console.log('Database query successful:', result.rows[0]);
      
      client.release();
      connected = true;
      
      // In development, we don't need to monitor the connection as aggressively
      if (process.env.NODE_ENV === 'production') {
        // Add connection status monitoring
        setInterval(async () => {
          try {
            const client = await pool.connect();
            client.release();
          } catch (err) {
            console.error('Connection check failed:', err);
          }
        }, 60000); // Check every minute
      }
      
    } catch (err) {
      console.error(`Database connection error (${retries} retries left):`, err.message);
      retries--;
      
      if (retries === 0) {
        console.error('Failed to connect to database after multiple attempts');
        if (process.env.NODE_ENV === 'production') {
          process.exit(-1);
        } else {
          // In development, just log the error and continue
          console.log('In development mode: continuing despite database errors');
          connected = true; // Break the loop
        }
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, 3 - retries) * 1000));
    }
  }

  return connected;
}

// Initialize the pool but don't crash in development
try {
  initializePool().catch(err => {
    console.error('Failed to initialize database pool:', err);
    if (process.env.NODE_ENV === 'production') {
      process.exit(-1);
    } else {
      console.log('In development mode: continuing despite database initialization failure');
    }
  });
} catch (err) {
  console.error('Error initializing database pool:', err);
  if (process.env.NODE_ENV === 'production') {
    process.exit(-1);
  } else {
    console.log('In development mode: continuing despite database error');
  }
}

export { initializePool };