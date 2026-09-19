import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

const isProd = process.env.NODE_ENV === 'production';

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  if (isProd) {
    throw new Error(
      'NEXT_PUBLIC_API_URL must be a valid URL in production.'
    );
  }
}

export const env = {
  NEXT_PUBLIC_API_URL:
    parsed.success
      ? parsed.data.NEXT_PUBLIC_API_URL
      : 'http://localhost:4000/api',
};
