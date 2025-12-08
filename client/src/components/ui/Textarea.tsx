import { cn } from "@/lib/utils";
import React from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const textareaId =
      id || `textarea-${label?.toLowerCase().replace(/\s+/g, "-")}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            "w-full px-4 py-2 border rounded-lg transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500",
            "placeholder:text-gray-400 text-gray-900",
            "disabled:bg-gray-100 disabled:cursor-not-allowed",
            "resize-none",
            className
          )}
          ref={ref}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error || helperText ? `${textareaId}-helper` : undefined
          }
          {...props}
        />
        {(error || helperText) && (
          <p
            id={`${textareaId}-helper`}
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

Textarea.displayName = "Textarea";
