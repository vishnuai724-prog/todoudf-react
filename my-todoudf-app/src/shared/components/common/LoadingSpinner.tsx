import { CheckSquare } from 'lucide-react'

// ─── Full-page loading spinner used as Suspense fallback ──────────────────────

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
          <CheckSquare className="w-6 h-6 text-white" />
        </div>
        <div className="absolute inset-0 rounded-2xl border-2 border-violet-500/50 animate-ping" />
      </div>
      <p className="text-slate-500 text-sm animate-pulse">Loading…</p>
    </div>
  )
}
