import React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  badge?: string;
  title: React.ReactNode;
  description?: string;
  className?: string;
  badgeClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  align?: "center" | "left";
}

export function SectionHeader({
  badge,
  title,
  description,
  className,
  badgeClassName,
  titleClassName,
  descriptionClassName,
  align = "center",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-12 sm:mb-16",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      {badge && (
        <div
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6",
            "bg-indigo-100 text-indigo-700 border border-indigo-200/50",
            badgeClassName
          )}
        >
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
          {badge}
        </div>
      )}
      <h2
        className={cn(
          "text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 tracking-tight",
          "text-gray-900",
          align === "center" && "mx-auto",
          titleClassName
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-gray-600 text-lg sm:text-xl leading-relaxed",
            align === "center" && "max-w-2xl mx-auto",
            align === "left" && "max-w-xl",
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
