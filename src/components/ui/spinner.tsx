import * as React from "react"
import { cn } from "@/lib/utils"

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "purple" | "orange" | "teal" | "red"
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "md", variant = "default", ...props }, ref) => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-6 h-6", 
      lg: "w-8 h-8",
      xl: "w-12 h-12"
    }

    const variantClasses = {
      default: "border-white/20 border-t-white",
      purple: "border-purple-400/20 border-t-purple-400",
      orange: "border-orange-400/20 border-t-orange-400", 
      teal: "border-teal-400/20 border-t-teal-400",
      red: "border-red-400/20 border-t-red-400"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "animate-spin border border-solid",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      />
    )
  }
)

Spinner.displayName = "Spinner"

export { Spinner } 