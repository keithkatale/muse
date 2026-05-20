import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'

/** Section tones — button label matches that area's text color */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[16px] border text-sm font-sans font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6CDA1]/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:border-transparent disabled:bg-[#EFEFEF] disabled:text-[#9A9A9A] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        /** Light sections (cream bg, brown text) — label #564738 */
        default:
          'border-transparent bg-[#F6CDA1] text-[#564738] hover:bg-[#F6CDA1]/90',
        /** Dark sections (brown bg, cream text) — label #FEF8F2 */
        dark:
          'border-transparent bg-[#F6CDA1] text-[#FEF8F2] hover:bg-[#F6CDA1]/90',
        /** Secondary on light — brown border & label */
        outline:
          'border-[#564738] bg-white text-[#564738] hover:bg-[#FEF8F2]',
        /** Secondary on dark — cream border & label */
        'outline-dark':
          'border-[#FEF8F2] bg-transparent text-[#FEF8F2] hover:bg-[#FEF8F2]/10',
        secondary:
          'border-[#564738] bg-white text-[#564738] hover:bg-[#FEF8F2]',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90',
        ghost:
          'border-transparent bg-transparent text-[#564738] hover:bg-[#FDE2C4]',
        'ghost-dark':
          'border-transparent bg-transparent text-[#FEF8F2] hover:bg-[#FEF8F2]/10',
        link: 'border-transparent bg-transparent text-[#564738] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-12 px-10 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  /** Processing state — spinner + keeps variant colors */
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, loading = false, disabled, children, ...props },
    ref,
  ) => {
    const isDisabled = disabled || loading
    const classes = cn(
      buttonVariants({ variant, size, className }),
      isDisabled && asChild && 'pointer-events-none opacity-50',
    )

    if (asChild) {
      return (
        <Slot
          className={classes}
          ref={ref}
          aria-busy={loading || undefined}
          aria-disabled={isDisabled || undefined}
          {...props}
        >
          {children}
        </Slot>
      )
    }

    return (
      <button
        className={classes}
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && <Loader2 className="animate-spin" aria-hidden />}
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
