import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { useAuth } from '../hooks/useAuth'
import { registerSchema, type RegisterFormData } from '../schemas/auth.schema'
import { ROUTES } from '@/shared/constants/routes'
import { CheckSquare, Mail, Lock, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react'

export default function RegisterPage() {
  const { register: registerUser, isRegistering } = useAuth()
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '',
      maritalStatus: '',
      religion: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const password = useWatch({ control, name: 'password', defaultValue: '' })
  const confirmPassword = useWatch({ control, name: 'confirmPassword', defaultValue: '' })
  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3
  const strengthLabel = ['', 'Weak', 'Fair', 'Strong']
  const strengthColor = ['', 'bg-red-500', 'bg-amber-500', 'bg-emerald-500']

  const onSubmit = (data: RegisterFormData) => {
    // useAuth.register handles navigation and toasts
    registerUser(data)
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-6 py-12">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-125 h-125 rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-100 h-100 rounded-full bg-violet-600/15 blur-[120px]" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
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
            <CardTitle>Create your account</CardTitle>
            <CardDescription>Start managing your tasks for free</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" id="register-form" noValidate>

              {/* Personal Details Group */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-violet-400 border-b border-white/10 pb-2">Personal Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-firstName">First Name</Label>
                    <Input id="register-firstName" placeholder="John" className={errors.firstName ? 'border-red-500/50' : ''} {...register('firstName')} />
                    {errors.firstName && <p className="text-xs text-red-400">{errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-middleName">Middle Name (Optional)</Label>
                    <Input id="register-middleName" placeholder="M" {...register('middleName')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-lastName">Last Name</Label>
                    <Input id="register-lastName" placeholder="Doe" className={errors.lastName ? 'border-red-500/50' : ''} {...register('lastName')} />
                    {errors.lastName && <p className="text-xs text-red-400">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-dob">Date of Birth</Label>
                    <Input id="register-dob" type="date" className={`scheme-dark ${errors.dateOfBirth ? 'border-red-500/50' : ''}`} {...register('dateOfBirth')} />
                    {errors.dateOfBirth && <p className="text-xs text-red-400">{errors.dateOfBirth.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-marital">Marital Status</Label>
                    <Select onValueChange={(v) => setValue('maritalStatus', v, { shouldValidate: true })}>
                      <SelectTrigger className={errors.maritalStatus ? 'border-red-500/50' : ''}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.maritalStatus && <p className="text-xs text-red-400">{errors.maritalStatus.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-religion">Religion</Label>
                    <Select onValueChange={(v) => setValue('religion', v, { shouldValidate: true })}>
                      <SelectTrigger className={errors.religion ? 'border-red-500/50' : ''}>
                        <SelectValue placeholder="Select religion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Christianity">Christianity</SelectItem>
                        <SelectItem value="Islam">Islam</SelectItem>
                        <SelectItem value="Hinduism">Hinduism</SelectItem>
                        <SelectItem value="Buddhism">Buddhism</SelectItem>
                        <SelectItem value="Judaism">Judaism</SelectItem>
                        <SelectItem value="Other">Other / Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.religion && <p className="text-xs text-red-400">{errors.religion.message}</p>}
                  </div>
                </div>
              </div>

              {/* Account Details Group */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-violet-400 border-b border-white/10 pb-2">Account Security</h3>

                <div className="space-y-2">
                  <Label htmlFor="register-email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    <Input id="register-email" type="email" autoComplete="email" placeholder="you@example.com" className={`pl-9 ${errors.email ? 'border-red-500/50' : ''}`} {...register('email')} />
                  </div>
                  {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      <Input
                        id="register-password"
                        type={showPass ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="At least 6 characters"
                        className={`pl-9 pr-10 ${errors.password ? 'border-red-500/50' : ''}`}
                        {...register('password')}
                      />
                      <button type="button" onClick={() => setShowPass((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white" aria-label="Toggle password visibility">
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
                    {password && (
                      <div className="space-y-1">
                        <div className="flex gap-1">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= passwordStrength ? strengthColor[passwordStrength] : 'bg-white/10'}`} />
                          ))}
                        </div>
                        <p className="text-xs text-slate-500">Strength: <span className={passwordStrength === 3 ? 'text-emerald-400' : passwordStrength === 2 ? 'text-amber-400' : 'text-red-400'}>{strengthLabel[passwordStrength]}</span></p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm">Confirm password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      <Input
                        id="register-confirm"
                        type={showConfirm ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="Repeat your password"
                        className={`pl-9 pr-10 ${errors.confirmPassword ? 'border-red-500/50' : ''}`}
                        {...register('confirmPassword')}
                      />
                      <button type="button" onClick={() => setShowConfirm((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white" aria-label="Toggle confirm password visibility">
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>}
                    {confirmPassword && password && !errors.confirmPassword && (
                      <div className="flex items-center gap-1 text-xs text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" /> Passwords match
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Button id="register-submit" variant="gradient" className="w-full h-11 mt-4" type="submit" disabled={isRegistering}>
                {isRegistering ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account…
                  </span>
                ) : (
                  <>Create Account <ArrowRight className="w-4 h-4" /></>
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link to={ROUTES.LOGIN} className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
