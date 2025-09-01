
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 focus:bg-primary-600 focus:ring-2 focus:ring-primary-200 shadow-button hover:shadow-button-hover",
        destructive: "bg-destructive-500 text-white hover:bg-destructive-600 active:bg-destructive-700 focus:bg-destructive-600 focus:ring-2 focus:ring-destructive-200 shadow-button hover:shadow-button-hover",
        outline: "border border-secondary-300 bg-white text-secondary-700 hover:bg-secondary-50 hover:border-secondary-400 active:bg-secondary-100 focus:bg-secondary-50 focus:ring-2 focus:ring-primary-200 shadow-button hover:shadow-button-hover",
        secondary: "bg-secondary-100 text-secondary-700 hover:bg-secondary-200 active:bg-secondary-300 focus:bg-secondary-200 focus:ring-2 focus:ring-primary-200 shadow-button hover:shadow-button-hover",
        ghost: "text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900 active:bg-secondary-200 focus:bg-secondary-100 focus:ring-2 focus:ring-primary-200",
        link: "text-primary-600 underline-offset-4 hover:underline hover:text-primary-700 active:text-primary-800 focus:text-primary-700 focus:ring-2 focus:ring-primary-200 focus:rounded-sm",
        success: "bg-success-500 text-white hover:bg-success-600 active:bg-success-700 focus:bg-success-600 focus:ring-2 focus:ring-success-200 shadow-button hover:shadow-button-hover",
        warning: "bg-warning-500 text-white hover:bg-warning-600 active:bg-warning-700 focus:bg-warning-600 focus:ring-2 focus:ring-warning-200 shadow-button hover:shadow-button-hover",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-6 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
