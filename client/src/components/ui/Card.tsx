import { cn } from "@/lib/utils";
import React from "react";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "outlined" | "glass" | "gradient";
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
  children,
  className,
  variant = "default",
  hover = false,
  padding = "none",
}: CardProps) {
  const variants = {
    default: "bg-white border border-[#1c2942]/10",
    elevated: "bg-white shadow-lg shadow-[#1c2942]/10",
    outlined: "bg-white border-2 border-[#1c2942]/20",
    glass: "glass",
    gradient: "bg-gradient-to-br from-white to-[#ebf2fa] border border-[#1c2942]/10",
  };

  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const hoverStyles = hover
    ? "transition-all duration-300 hover:shadow-xl hover:shadow-[#1c2942]/10 hover:border-[#6d74b5]/30 hover:-translate-y-1 cursor-pointer"
    : "";

  return (
    <div
      className={cn(
        "rounded-2xl overflow-hidden",
        variants[variant],
        paddings[padding],
        hoverStyles,
        className
      )}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export function CardHeader({ children, className, actions }: CardHeaderProps) {
  return (
    <div className={cn("px-6 py-5 border-b border-gray-100", className)}>
      <div className="flex items-center justify-between">
        <div>{children}</div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn("px-6 py-4 bg-gray-50/50 border-t border-gray-100", className)}>
      {children}
    </div>
  );
}

export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4";
}

export function CardTitle({ children, className, as: Component = "h3" }: CardTitleProps) {
  return (
    <Component className={cn("text-lg font-semibold text-gray-900", className)}>
      {children}
    </Component>
  );
}

export interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p className={cn("text-sm text-gray-500 mt-1", className)}>
      {children}
    </p>
  );
}
