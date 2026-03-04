import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow hover:shadow-glow",
        secondary:
          "border-transparent bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm",
        destructive:
          "border-transparent bg-gradient-to-r from-red-600 to-red-500 text-white shadow hover:from-red-500 hover:to-red-400",
        outline: "border-white/20 text-white/80 hover:bg-white/10 hover:text-white",
        glass: "border-white/10 bg-white/5 backdrop-blur-md text-white/90 hover:bg-white/10",
        accent: "border-transparent bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow hover:shadow-glow-accent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
