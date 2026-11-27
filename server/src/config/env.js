import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  MONGO_URI: z
    .string()
    .trim()
    .min(1, 'MONGO_URI is required')
    .default('mongodb://127.0.0.1:27017/disc_careerguide'),
  JWT_SECRET: z
    .string()
    .min(1, 'JWT_SECRET is required')
    .default('change_me_in_production'),
  JWT_EXPIRES_IN: z.string().trim().min(1).default('7d'),
  GEMINI_API_KEY: z.string().trim().optional().default(''),
  GEMINI_MODEL: z.string().trim().min(1).default('gemini-3.5-flash-lite'),
  CLIENT_URL: z.string().trim().min(1).default('http://localhost:5173'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const formatted = parsed.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('; ');
  throw new Error(`Invalid environment configuration: ${formatted}`);
}

const config = parsed.data;

if (config.NODE_ENV === 'production' && config.JWT_SECRET === 'change_me_in_production') {
  throw new Error('JWT_SECRET must be set to a secure value in production');
}

export const env = Object.freeze(config);
export default env;
