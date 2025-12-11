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
      "bg-indigo-600 text-white",
      "hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/25",
      "focus-visible:ring-indigo-500",
      "btn-shimmer",
    ],
    secondary: [
      "bg-gray-100 text-gray-900",
      "hover:bg-gray-200 hover:shadow-md",
      "focus-visible:ring-gray-500",
    ],
    outline: [
      "border-2 border-indigo-600 text-indigo-600 bg-transparent",
      "hover:bg-indigo-50 hover:border-indigo-700 hover:text-indigo-700",
      "focus-visible:ring-indigo-500",
    ],
    ghost: [
      "text-gray-600 bg-transparent",
      "hover:bg-gray-100 hover:text-gray-900",
      "focus-visible:ring-gray-500",
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
      "bg-gradient-to-r from-indigo-600 to-purple-600 text-white",
      "hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:shadow-indigo-500/30",
      "focus-visible:ring-indigo-500",
      "btn-shimmer",
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
