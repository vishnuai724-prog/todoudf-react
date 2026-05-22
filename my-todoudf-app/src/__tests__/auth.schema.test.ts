import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema } from '@/features/auth/schemas/auth.schema'

// ─── Login schema tests ───────────────────────────────────────────────────────
describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: 'secret123' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'secret123' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path[0]).toBe('email')
  })

  it('rejects short password', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: '123' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path[0]).toBe('password')
  })

  it('rejects empty email', () => {
    const result = loginSchema.safeParse({ email: '', password: 'secret123' })
    expect(result.success).toBe(false)
  })
})

// ─── Register schema tests ────────────────────────────────────────────────────
describe('registerSchema', () => {
  const valid = {
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
    maritalStatus: 'Single',
    religion: 'None',
    email: 'john@example.com',
    password: 'password123',
    confirmPassword: 'password123',
  }

  it('accepts valid registration data', () => {
    const result = registerSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({ ...valid, confirmPassword: 'different' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path[0]).toBe('confirmPassword')
  })

  it('rejects short first name', () => {
    const result = registerSchema.safeParse({ ...valid, firstName: '' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path[0]).toBe('firstName')
  })

  it('rejects missing email', () => {
    const result = registerSchema.safeParse({ ...valid, email: '' })
    expect(result.success).toBe(false)
  })
})
