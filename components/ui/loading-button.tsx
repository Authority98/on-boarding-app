"use client"

import { forwardRef } from "react"
import { Button } from "@/components/ui/button"
import { ButtonLoading } from "@/components/ui/loading"
import { cn } from "@/lib/utils"
import { VariantProps } from "class-variance-authority"
import { buttonVariants } from "@/components/ui/button"

interface LoadingButtonProps 
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  loadingText?: string
  icon?: React.ReactNode
  asChild?: boolean
}

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ 
    children, 
    loading = false, 
    loadingText, 
    disabled, 
    className, 
    icon,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading

    return (
      <Button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          "relative transition-all duration-200",
          loading && "cursor-not-allowed",
          className
        )}
        {...props}
      >
        <span className={cn(
          "flex items-center gap-2 transition-opacity duration-200",
          loading && "opacity-0"
        )}>
          {icon && !loading && icon}
          {children}
        </span>
        
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center gap-2">
            <ButtonLoading size={props.size === "sm" ? "sm" : "md"} />
            {loadingText && (
              <span className="text-sm">{loadingText}</span>
            )}
          </div>
        )}
      </Button>
    )
  }
)

LoadingButton.displayName = "LoadingButton"

export { LoadingButton }