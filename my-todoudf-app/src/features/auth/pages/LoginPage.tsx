import { useActionState, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useAuthStore } from '../store/authStore'
import { authApi } from '../api/auth.api'
import { loginSchema } from '../schemas/auth.schema'
import { ROUTES } from '@/shared/constants/routes'
import type { LoginResponse } from '../types/auth.types'
import { CheckSquare, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'

// ─── Action state type ────────────────────────────────────────────────────────
type FieldErrors = { email?: string[]; password?: string[]; root?: string[] }

type LoginState =
  | { status: 'idle'; errors: null; data: null }
  | { status: 'error'; errors: FieldErrors; data: null }
  | { status: 'success'; errors: null; data: LoginResponse }

const INITIAL_STATE: LoginState = { status: 'idle', errors: null, data: null }

// ─── Action function ──────────────────────────────────────────────────────────
// Defined outside the component — cannot close over hooks or component state.
// This is the React 19 pattern for form actions in a Vite SPA (not a Server
// Action — those are Next.js App Router only).

async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return {
      status: 'error',
      errors: parsed.error.flatten().fieldErrors as FieldErrors,
      data: null,
    }
  }

  try {
    const data = await authApi.login(parsed.data)
    return { status: 'success', errors: null, data }
  } catch (err) {
    const message =
      err instanceof AxiosError
        ? ((err.response?.data as { message?: string })?.message ?? 'Invalid credentials.')
        : 'Something went wrong. Please try again.'
    return { status: 'error', errors: { root: [message] }, data: null }
  }
}

// ─── LoginPage ────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, INITIAL_STATE)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  // Side-effects on success: update store, toast, navigate.
  // Cannot be done inside the action (no hooks), so useEffect is the correct place.
  useEffect(() => {
    if (state.status !== 'success') return
    // Use getState() inside effects — no subscription needed for action functions
    const { setUser, setAccessToken } = useAuthStore.getState()
    setUser(state.data.user)
    setAccessToken(state.data.accessToken)
    toast.success(`Welcome back, ${state.data.user.name}!`)
    navigate(ROUTES.TODOS, { replace: true })
  }, [state, navigate])

  const errors = state.status === 'error' ? state.errors : null

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-6">
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-600/15 blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link to={ROUTES.HOME} className="flex items-center justify-center gap-2 mb-8 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-shadow">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            TodoFlow
          </span>
        </Link>

        <Card>
          <CardHeader className="text-center pb-4">
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Sign in to access your todos</CardDescription>
          </CardHeader>

          <CardContent>
            {/* Root / server error */}
            {errors?.root && (
              <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                {errors.root[0]}
              </div>
            )}

            {/*
              React 19: <form action={formAction}> — native form submission.
              Inputs are uncontrolled (name attribute). Values read from FormData.
              isPending from useActionState replaces isLoggingIn from a mutation.
            */}
            <form action={formAction} className="space-y-5" id="login-form" noValidate>
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="login-email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className={`pl-9 ${errors?.email ? 'border-red-500/50 focus-visible:ring-red-500' : ''}`}
                  />
                </div>
                {errors?.email && (
                  <p className="text-xs text-red-400">{errors.email[0]}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <Input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className={`pl-9 pr-10 ${errors?.password ? 'border-red-500/50 focus-visible:ring-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors?.password && (
                  <p className="text-xs text-red-400">{errors.password[0]}</p>
                )}
              </div>

              <Button
                id="login-submit"
                variant="gradient"
                className="w-full h-11"
                type="submit"
                disabled={isPending}
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  <>Sign In <ArrowRight className="w-4 h-4" /></>
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <Link
                to={ROUTES.REGISTER}
                className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
              >
                Create one free
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
