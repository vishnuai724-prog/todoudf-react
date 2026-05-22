import { http, HttpResponse } from 'msw'
import { env } from '@/shared/lib/env'

const BASE = env.VITE_API_URL

export const authHandlers = [
  // POST /auth/login
  http.post(`${BASE}/auth/login`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string }

    if (body.email === 'test@example.com' && body.password === 'password123') {
      return HttpResponse.json({
        user: {
          id: 'user-1',
          firstName: 'Test',
          lastName: 'User',
          name: 'Test User',
          email: 'test@example.com',
          dateOfBirth: '1990-01-01',
          maritalStatus: 'Single',
          religion: 'None',
        },
        accessToken: 'mock-access-token',
      })
    }

    return HttpResponse.json(
      { message: 'Invalid email or password.' },
      { status: 401 },
    )
  }),

  // POST /auth/register
  http.post(`${BASE}/auth/register`, () =>
    HttpResponse.json({ message: 'User created.' }, { status: 201 }),
  ),

  // POST /auth/logout
  http.post(`${BASE}/auth/logout`, () =>
    new HttpResponse(null, { status: 204 }),
  ),

  // GET /auth/me
  http.get(`${BASE}/auth/me`, ({ request }) => {
    const auth = request.headers.get('Authorization')
    if (!auth?.includes('mock-access-token')) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    return HttpResponse.json({
      id: 'user-1',
      firstName: 'Test',
      lastName: 'User',
      name: 'Test User',
      email: 'test@example.com',
      dateOfBirth: '1990-01-01',
      maritalStatus: 'Single',
      religion: 'None',
    })
  }),
]
