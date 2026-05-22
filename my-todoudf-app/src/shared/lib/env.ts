import { z } from 'zod'

const envSchema = z.object({
  VITE_API_URL: z
    .string({ error: 'VITE_API_URL is required' })
    .min(1, 'VITE_API_URL must not be empty'),
  MODE: z.string().default('development'),
  DEV: z.boolean().default(true),
  PROD: z.boolean().default(false),
})

function validateEnv() {
  const result = envSchema.safeParse({
    VITE_API_URL: import.meta.env.VITE_API_URL,
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
  })

  if (!result.success) {
    const messages = result.error.issues
      .map((issue) => `  • ${issue.path.join('.')}: ${issue.message}`)
      .join('\n')

    throw new Error(`\n Invalid environment variables:\n${messages}\n\nCheck your .env file.\n`)
  }

  return result.data
}

export const env = validateEnv()
