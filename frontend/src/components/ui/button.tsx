import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'icon'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
        variant === 'default' && 'bg-primary text-primary-foreground',
        variant === 'ghost' && 'hover:bg-muted',
        variant === 'outline' && 'border border-input bg-background hover:bg-muted',
        size === 'default' && 'h-9 px-4 py-2',
        size === 'sm' && 'h-8 px-3',
        size === 'icon' && 'size-9',
        className,
      )}
      {...props}
    />
  ),
)
Button.displayName = 'Button'
