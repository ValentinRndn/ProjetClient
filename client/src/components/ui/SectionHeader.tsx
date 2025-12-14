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
            "bg-[#ebf2fa] text-[#6d74b5] border border-[#6d74b5]/20",
            badgeClassName
          )}
        >
          <span className="w-1.5 h-1.5 bg-[#6d74b5] rounded-full" />
          {badge}
        </div>
      )}
      <h2
        className={cn(
          "text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 tracking-tight",
          "text-[#1c2942]",
          align === "center" && "mx-auto",
          titleClassName
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-[#1c2942]/70 text-lg sm:text-xl leading-relaxed",
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
