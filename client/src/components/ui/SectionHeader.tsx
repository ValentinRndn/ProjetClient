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
}

export function SectionHeader({
  badge,
  title,
  description,
  className,
  badgeClassName,
  titleClassName,
  descriptionClassName,
}: SectionHeaderProps) {
  return (
    <div className={cn("text-center mb-16", className)}>
      {badge && (
        <div
          className={cn(
            "inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4",
            badgeClassName
          )}
        >
          {badge}
        </div>
      )}
      <h2
        className={cn(
          "text-4xl md:text-5xl font-extrabold text-center mb-4",
          titleClassName
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-center text-gray-700 text-lg max-w-2xl mx-auto",
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
