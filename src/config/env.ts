import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
}

export const env = {
  NEXT_PUBLIC_API_URL:
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
};
