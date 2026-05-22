import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

// ─── ErrorBoundary ────────────────────────────────────────────────────────────
// Class component required — React error boundaries must be class-based.

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Replace with your error tracking service (Sentry, etc.)
    console.error('[ErrorBoundary] Uncaught error:', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
            <p className="text-slate-400 text-sm mb-2">
              An unexpected error occurred. The error has been logged.
            </p>
            {import.meta.env.DEV && (
              <pre className="text-left text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 overflow-auto max-h-40">
                {this.state.error?.message}
              </pre>
            )}
            <Button variant="gradient" onClick={this.handleReset}>
              <RefreshCw className="w-4 h-4" /> Try Again
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
