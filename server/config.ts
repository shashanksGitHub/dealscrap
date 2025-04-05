import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
config({ path: path.resolve(__dirname, '../.env') });

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'SESSION_SECRET',
  'PORT',
  'NODE_ENV'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const CONFIG = {
  DATABASE_URL: process.env.DATABASE_URL,
  SESSION_SECRET: process.env.SESSION_SECRET,
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV,
  APIFY_TOKEN: process.env.APIFY_TOKEN,
  BASE_URL: process.env.BASE_URL,
  CUSTOM_DOMAIN: process.env.CUSTOM_DOMAIN,
  REDIS_URL: process.env.REDIS_URL
} as const; 