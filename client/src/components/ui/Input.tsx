import { cn } from "@/lib/utils";
import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            "w-full px-4 py-2 border rounded-lg transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500",
            "placeholder:text-gray-400 text-gray-900",
            "disabled:bg-gray-100 disabled:cursor-not-allowed",
            className
          )}
          ref={ref}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error || helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        {(error || helperText) && (
          <p
            id={`${inputId}-helper`}
            className={cn(
              "mt-1 text-sm",
              error ? "text-red-600" : "text-gray-500"
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
