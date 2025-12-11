import { cn } from "@/lib/utils";
import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "filled";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      variant = "default",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;

    const variants = {
      default: [
        "bg-white border-gray-200",
        "hover:border-gray-300",
        error
          ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
          : "focus:border-indigo-500 focus:ring-indigo-500/20",
      ],
      filled: [
        "bg-gray-50 border-transparent",
        "hover:bg-gray-100",
        error
          ? "bg-red-50 focus:bg-white focus:border-red-500 focus:ring-red-500/20"
          : "focus:bg-white focus:border-indigo-500 focus:ring-indigo-500/20",
      ],
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
            {props.required && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            id={inputId}
            className={cn(
              "w-full px-4 py-2.5 border rounded-xl",
              "text-gray-900 placeholder:text-gray-400",
              "transition-all duration-200",
              "focus:outline-none focus:ring-4",
              "disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed",
              variants[variant],
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            ref={ref}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error || helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p
            id={`${inputId}-helper`}
            className={cn(
              "mt-2 text-sm flex items-center gap-1",
              error ? "text-red-600" : "text-gray-500"
            )}
          >
            {error && (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
