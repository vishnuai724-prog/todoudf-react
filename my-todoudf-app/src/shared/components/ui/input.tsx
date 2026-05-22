import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/utils'

// React 19: ref is a first-class prop on function components.
// forwardRef is no longer needed for native HTML element wrappers.
// React.ComponentProps<'input'> includes ref automatically in React 19 types.

export type InputProps = ComponentProps<'input'>

function Input({ className, type, ref, ...props }: InputProps) {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:border-violet-500 disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-sm',
        className,
      )}
      {...props}
    />
  )
}
Input.displayName = 'Input'

export { Input }
