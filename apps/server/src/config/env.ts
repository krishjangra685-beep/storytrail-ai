import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('8080').transform(Number),
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
  // Firebase credentials are optional in development (mock service is used)
  FIREBASE_PROJECT_ID: z.string().default('dev-placeholder'),
  FIREBASE_CLIENT_EMAIL: z.string().default('dev@placeholder.com'),
  FIREBASE_PRIVATE_KEY: z.string().default('dev-placeholder-key'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  parsed.error.issues.forEach((issue) => {
    console.error(`  ${issue.path.join('.')}: ${issue.message}`);
  });
  process.exit(1);
}

export const env = parsed.data;
