import { z } from 'zod'

// ─── Login schema ─────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

export type LoginFormData = z.infer<typeof loginSchema>

// ─── Register schema ──────────────────────────────────────────────────────────
export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'First name is required')
      .max(50, 'First name must be at most 50 characters'),
    middleName: z.string().max(50).optional(),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .max(50, 'Last name must be at most 50 characters'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    maritalStatus: z.string().min(1, 'Marital status is required'),
    religion: z.string().min(1, 'Religion is required'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password must be at most 100 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type RegisterFormData = z.infer<typeof registerSchema>
