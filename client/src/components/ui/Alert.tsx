import { cn } from "@/lib/utils";
import React from "react";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";

export interface AlertProps {
  type?: "success" | "error" | "warning" | "info";
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertCircle,
  info: Info,
};

const styles = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
};

export function Alert({
  type = "info",
  title,
  children,
  onClose,
  className,
}: AlertProps) {
  const Icon = icons[type];

  return (
    <div
      className={cn(
        "border rounded-lg p-4 flex items-start gap-3",
        styles[type],
        className
      )}
      role="alert"
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-1">{title}</h4>}
        <div className="text-sm">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
