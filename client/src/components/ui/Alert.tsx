import { cn } from "@/lib/utils";
import React from "react";
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from "lucide-react";

export interface AlertProps {
  type?: "success" | "error" | "warning" | "info";
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
  variant?: "filled" | "light" | "outline";
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const filledStyles = {
  success: "bg-emerald-500 text-white",
  error: "bg-red-500 text-white",
  warning: "bg-amber-500 text-white",
  info: "bg-indigo-500 text-white",
};

const lightStyles = {
  success: "bg-emerald-50 border-emerald-200 text-emerald-800",
  error: "bg-red-50 border-red-200 text-red-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
  info: "bg-indigo-50 border-indigo-200 text-indigo-800",
};

const outlineStyles = {
  success: "border-2 border-emerald-500 text-emerald-700 bg-white",
  error: "border-2 border-red-500 text-red-700 bg-white",
  warning: "border-2 border-amber-500 text-amber-700 bg-white",
  info: "border-2 border-indigo-500 text-indigo-700 bg-white",
};

const iconColors = {
  success: { filled: "text-white", light: "text-emerald-500", outline: "text-emerald-500" },
  error: { filled: "text-white", light: "text-red-500", outline: "text-red-500" },
  warning: { filled: "text-white", light: "text-amber-500", outline: "text-amber-500" },
  info: { filled: "text-white", light: "text-indigo-500", outline: "text-indigo-500" },
};

export function Alert({
  type = "info",
  title,
  children,
  onClose,
  className,
  variant = "light",
}: AlertProps) {
  const Icon = icons[type];

  const styles = {
    filled: filledStyles,
    light: lightStyles,
    outline: outlineStyles,
  };

  return (
    <div
      className={cn(
        "rounded-xl p-4 flex items-start gap-3",
        "animate-fade-in-up",
        variant !== "filled" && "border",
        styles[variant][type],
        className
      )}
      role="alert"
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          variant === "filled" ? "bg-white/20" : "bg-current/10"
        )}
      >
        <Icon
          className={cn(
            "w-4 h-4",
            variant === "filled" ? "text-white" : iconColors[type][variant]
          )}
        />
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        {title && (
          <h4 className="font-semibold text-sm mb-1">{title}</h4>
        )}
        <div className={cn("text-sm", variant === "filled" ? "text-white/90" : "opacity-90")}>
          {children}
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={cn(
            "flex-shrink-0 p-1 rounded-lg transition-all duration-200",
            variant === "filled"
              ? "hover:bg-white/20 text-white/70 hover:text-white"
              : "hover:bg-current/10 opacity-60 hover:opacity-100"
          )}
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
