
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary-500 text-white hover:bg-primary-600",
        secondary: "border-transparent bg-secondary-100 text-secondary-700 hover:bg-secondary-200",
        destructive: "border-transparent bg-destructive-500 text-white hover:bg-destructive-600",
        success: "border-transparent bg-success-500 text-white hover:bg-success-600",
        warning: "border-transparent bg-warning-500 text-white hover:bg-warning-600",
        outline: "border-secondary-300 text-secondary-700 hover:bg-secondary-50",
        "outline-primary": "border-primary-300 text-primary-700 hover:bg-primary-50",
        "outline-destructive": "border-destructive-300 text-destructive-700 hover:bg-destructive-50",
        "outline-success": "border-success-300 text-success-700 hover:bg-success-50",
        "outline-warning": "border-warning-300 text-warning-700 hover:bg-warning-50",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
