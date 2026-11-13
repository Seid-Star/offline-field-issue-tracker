import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory if present, else fallback to root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  PORT: z
    .string()
    .default('4000')
    .transform((val) => parseInt(val, 10)),
  MONGODB_URI: z
    .string()
    .default('mongodb://127.0.0.1:27017/offline_field_tracker'),
  CLIENT_URL: z.string().default('http://localhost:3000'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters long').default('offline_tracker_super_secure_jwt_secret_dev_32char_key!'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  COORDINATOR_SEED_EMAIL: z.string().email().optional(),
  COORDINATOR_SEED_PASSWORD: z.string().min(8).optional(),
  COORDINATOR_SEED_NAME: z.string().min(2).optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  throw new Error('Environment validation failed');
}

export const env = parsed.data;

