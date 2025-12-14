import { cn } from "@/lib/utils";
import React from "react";

export interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success" | "gradient";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = [
    "inline-flex items-center justify-center gap-2",
    "font-semibold rounded-xl",
    "cursor-pointer",
    "transition-all duration-200 ease-out",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
    "active:scale-[0.98]",
  ];

  const variants = {
    primary: [
      "bg-[#1c2942] text-white",
      "hover:bg-[#1c2942]/90 hover:shadow-lg hover:shadow-[#1c2942]/25",
      "focus-visible:ring-[#1c2942]",
    ],
    secondary: [
      "bg-[#ebf2fa] text-[#1c2942]",
      "hover:bg-[#ebf2fa]/80 hover:shadow-md",
      "focus-visible:ring-[#6d74b5]",
    ],
    outline: [
      "border-2 border-[#1c2942] text-[#1c2942] bg-transparent",
      "hover:bg-[#ebf2fa] hover:border-[#1c2942]",
      "focus-visible:ring-[#1c2942]",
    ],
    ghost: [
      "text-[#1c2942] bg-transparent",
      "hover:bg-[#ebf2fa] hover:text-[#1c2942]",
      "focus-visible:ring-[#6d74b5]",
    ],
    danger: [
      "bg-red-600 text-white",
      "hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/25",
      "focus-visible:ring-red-500",
    ],
    success: [
      "bg-emerald-600 text-white",
      "hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/25",
      "focus-visible:ring-emerald-500",
    ],
    gradient: [
      "bg-gradient-to-r from-[#1c2942] to-[#6d74b5] text-white",
      "hover:from-[#1c2942]/90 hover:to-[#6d74b5]/90 hover:shadow-lg hover:shadow-[#1c2942]/30",
      "focus-visible:ring-[#6d74b5]",
    ],
  };

  const sizes = {
    xs: "px-2.5 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-base",
    xl: "px-6 py-3.5 text-lg",
  };

  const iconSizes = {
    xs: "w-3 h-3",
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-5 h-5",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className={cn("animate-spin", iconSizes[size])}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Chargement...</span>
        </span>
      ) : (
        <>
          {leftIcon && <span className={iconSizes[size]}>{leftIcon}</span>}
          {children}
          {rightIcon && <span className={iconSizes[size]}>{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
