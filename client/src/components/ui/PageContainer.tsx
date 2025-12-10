import { cn } from "@/lib/utils";
import React from "react";

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  center?: boolean;
}

export function PageContainer({
  children,
  className,
  maxWidth = "md",
  center = true,
}: PageContainerProps) {
  const maxWidths = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  };

  return (
    <div
      className={cn(
        "w-full py-12 px-4 sm:px-6 lg:px-8",
        center ? "min-h-screen flex items-center justify-center" : "",
        className
      )}
    >
      <div className={cn("w-full", maxWidths[maxWidth])}>{children}</div>
    </div>
  );
}
