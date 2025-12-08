import { cn } from "@/lib/utils";
import React from "react";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "outlined";
}

export function Card({ children, className, variant = "default" }: CardProps) {
  const variants = {
    default: "bg-white border border-gray-200",
    elevated: "bg-white shadow-xl",
    outlined: "bg-white border-2 border-gray-300",
  };

  return (
    <div className={cn("rounded-2xl", variants[variant], className)}>
      {children}
    </div>
  );
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return <div className={cn("p-6 sm:p-8", className)}>{children}</div>;
}

export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn("p-6 sm:p-8 pt-0", className)}>{children}</div>;
}

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return <div className={cn("p-6 sm:p-8 pt-0", className)}>{children}</div>;
}
