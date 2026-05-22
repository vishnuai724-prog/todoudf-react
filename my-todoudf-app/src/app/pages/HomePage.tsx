import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { useAuth } from '@/features/auth/hooks/useAuth'
import {
  CheckSquare,
  Sparkles,
  Zap,
  Shield,
  BarChart3,
  ArrowRight,
  Star,
  Clock,
  Users,
  LogIn,
  UserPlus,
  LayoutDashboard,
  LogOut,
} from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Add, complete, and manage tasks in milliseconds. Zero friction, maximum productivity.',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20',
  },
  {
    icon: Shield,
    title: 'Private & Secure',
    description: 'Your tasks are yours. Authentication built-in with per-user data isolation.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
  },
  {
    icon: BarChart3,
    title: 'Track Progress',
    description: 'Visual progress indicators so you always know how productive your day is.',
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
    border: 'border-violet-400/20',
  },
  {
    icon: Clock,
    title: 'Stay Organized',
    description: 'Filter tasks by All, Active, or Completed. Never lose track of what matters.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/20',
  },
  {
    icon: Star,
    title: 'Beautifully Designed',
    description: 'A stunning dark-mode interface that makes productivity feel premium.',
    color: 'text-rose-400',
    bg: 'bg-rose-400/10',
    border: 'border-rose-400/20',
  },
  {
    icon: Users,
    title: 'Multi-Account',
    description: 'Register multiple accounts with isolated task lists for work and personal.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-400/10',
    border: 'border-indigo-400/20',
  },
]

const stats = [
  { value: '10k+', label: 'Tasks Completed' },
  { value: '99.9%', label: 'Uptime' },
  { value: '500+', label: 'Happy Users' },
  { value: '4.9★', label: 'Average Rating' },
]

export default function HomePage() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white overflow-x-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-150 h-150 rounded-full bg-violet-600/20 blur-[120px] animate-pulse" />
        <div className="absolute top-[30%] right-[-10%] w-125 h-125 rounded-full bg-indigo-600/15 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[-20%] left-[30%] w-100 h-100 rounded-full bg-cyan-600/10 blur-[120px] animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-shadow">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            TodoFlow
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-slate-400 hover:text-white transition-colors text-sm">Features</a>
          <a href="#stats" className="text-slate-400 hover:text-white transition-colors text-sm">Stats</a>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-slate-400 hidden sm:block">Hello, {user?.name}</span>
              <Button variant="gradient" size="sm" onClick={() => navigate('/todos')}>
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
              <Button variant="ghost" size="sm" onClick={() => logout()} className="text-slate-400 hover:text-white">
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="gradient-outline" size="sm" asChild>
                <Link to="/login"><LogIn className="w-4 h-4" /> Login</Link>
              </Button>
              <Button variant="gradient" size="sm" asChild>
                <Link to="/register"><UserPlus className="w-4 h-4" /> Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-32">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-sm mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4" />
          The smartest way to manage your tasks
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
          Stay{' '}
          <span className="bg-linear-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Productive.
          </span>
          <br />
          Stay{' '}
          <span className="bg-linear-to-r from-rose-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
            Organized.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
          TodoFlow is your beautifully simple task manager. Add todos, track progress, and crush your goals — all in one stunning interface.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {isAuthenticated ? (
            <Button variant="gradient" size="xl" onClick={() => navigate('/todos')}>
              Go to Dashboard <ArrowRight className="w-5 h-5" />
            </Button>
          ) : (
            <>
              <Button variant="gradient" size="xl" asChild>
                <Link to="/register">
                  Start for Free <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="gradient-outline" size="xl" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </>
          )}
        </div>

        {/* Hero visual */}
        <div className="mt-20 w-full max-w-3xl mx-auto">
          <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl shadow-violet-500/10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-amber-500/70" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
              <div className="ml-2 flex-1 h-7 rounded-lg bg-white/5 border border-white/10" />
            </div>
            <div className="space-y-3">
              {[
                { text: '✅ Design the new landing page', done: true, tag: 'Design' },
                { text: '✅ Set up React + shadcn/ui', done: true, tag: 'Dev' },
                { text: '⬜ Review pull requests', done: false, tag: 'Review' },
                { text: '⬜ Write unit tests for auth flow', done: false, tag: 'Testing' },
                { text: '⬜ Deploy to production', done: false, tag: 'Ops' },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${item.done
                      ? 'bg-emerald-500/10 border border-emerald-500/20'
                      : 'bg-white/5 border border-white/10'
                    }`}
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${item.done
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-white/30'
                      }`}
                  >
                    {item.done && <span className="text-white text-[10px]">✓</span>}
                  </div>
                  <span className={`flex-1 text-sm ${item.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {item.text.substring(3)}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Glow under card */}
          <div className="absolute left-1/2 -translate-x-1/2 w-100 h-25 bg-violet-600/20 blur-[60px] -mt-8 pointer-events-none" />
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="relative z-10 py-16 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl md:text-4xl font-black bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                {s.value}
              </div>
              <div className="text-slate-400 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to{' '}
              <span className="bg-linear-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                get things done
              </span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Powerful features wrapped in a stunning UI that makes work feel effortless.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div
                key={f.title}
                className={`group p-6 rounded-2xl border ${f.border} ${f.bg} hover:scale-105 transition-all duration-300 cursor-default`}
              >
                <div className={`w-11 h-11 rounded-xl ${f.bg} border ${f.border} flex items-center justify-center mb-4`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative rounded-3xl border border-violet-500/20 bg-linear-to-br from-violet-500/10 to-indigo-500/10 p-12 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-violet-600/10 to-transparent pointer-events-none" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10">
              Ready to boost your{' '}
              <span className="bg-linear-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                productivity?
              </span>
            </h2>
            <p className="text-slate-400 mb-8 relative z-10">
              Join thousands of users who use TodoFlow to organize their day.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
              {isAuthenticated ? (
                <Button variant="gradient" size="lg" onClick={() => navigate('/todos')}>
                  Open Dashboard <ArrowRight className="w-5 h-5" />
                </Button>
              ) : (
                <>
                  <Button variant="gradient" size="lg" asChild>
                    <Link to="/register">Create Free Account</Link>
                  </Button>
                  <Button variant="gradient-outline" size="lg" asChild>
                    <Link to="/login">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <CheckSquare className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            TodoFlow
          </span>
        </div>
        <p className="text-slate-500 text-sm">
          © 2026 TodoFlow. Built with React + shadcn/ui + Tailwind CSS.
        </p>
      </footer>
    </div>
  )
}
