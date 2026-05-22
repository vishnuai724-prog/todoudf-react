import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useAuth } from '../hooks/useAuth'
import { loginSchema, type LoginFormData } from '../schemas/auth.schema'
import { ROUTES } from '@/shared/constants/routes'
import { CheckSquare, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const { login, isLoggingIn } = useAuth()
  const [showPass, setShowPass] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = (data: LoginFormData) => {
    // useAuth.login handles navigation, toasts, and store writes
    login(data)
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-6">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-125 h-125 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-100 h-100 rounded-full bg-indigo-600/15 blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link to={ROUTES.HOME} className="flex items-center justify-center gap-2 mb-8 group">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-shadow">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            TodoFlow
          </span>
        </Link>

        <Card>
          <CardHeader className="text-center pb-4">
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Sign in to access your todos</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" id="login-form" noValidate>
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="login-email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    className={`pl-9 ${errors.email ? 'border-red-500/50 focus-visible:ring-red-500' : ''}`}
                    autoComplete="email"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-400">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <Input
                    id="login-password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className={`pl-9 pr-10 ${errors.password ? 'border-red-500/50 focus-visible:ring-red-500' : ''}`}
                    autoComplete="current-password"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400">{errors.password.message}</p>
                )}
              </div>

              <Button id="login-submit" variant="gradient" className="w-full h-11" type="submit" disabled={isLoggingIn}>
                {isLoggingIn ? (
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
              <Link to={ROUTES.REGISTER} className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                Create one free
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
