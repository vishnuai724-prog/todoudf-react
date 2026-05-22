import { Component, type ReactNode } from 'react'
import { ApiError } from '@/shared/lib/apiError'

interface Props {
  children: ReactNode
  feature: string
  fallback?: (error: Error, reset: () => void) => ReactNode
}

interface State {
  error: Error | null
}

export class FeatureBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error(`[FeatureBoundary:${this.props.feature}]`, error, info.componentStack)
  }

  private reset = () => this.setState({ error: null })

  render() {
    const { error } = this.state
    const { children, feature, fallback } = this.props

    if (!error) return children
    if (fallback) return fallback(error, this.reset)

    const isApiError = error instanceof ApiError
    const isServerError = isApiError && error.isServerError
    const message = isApiError ? error.message : 'An unexpected error occurred.'

    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
          <span className="text-2xl">{isServerError ? '🔥' : '⚠️'}</span>
        </div>
        <h2 className="text-white font-bold text-lg mb-2">
          {feature} failed to load
        </h2>
        <p className="text-slate-400 text-sm mb-6 max-w-sm">
          {message}
        </p>
        <button
          onClick={this.reset}
          className="px-5 py-2 rounded-xl bg-violet-500/20 border border-violet-500/30 text-violet-300 text-sm hover:bg-violet-500/30 transition-all cursor-pointer"
        >
          Try again
        </button>
      </div>
    )
  }
}
