import React from "react";
import { cn } from "@/lib/utils";

export interface Stat {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface HeroStatsProps {
  stats: Stat[];
  className?: string;
  variant?: "default" | "glass" | "solid";
}

export function HeroStats({ stats, className, variant = "glass" }: HeroStatsProps) {
  const variants = {
    default: "bg-white border-[#1c2942]/10",
    glass: "bg-white/80 backdrop-blur-xl border-[#1c2942]/10",
    solid: "bg-[#1c2942]/10 border-[#1c2942]/20",
  };

  return (
    <div
      className={cn(
        "grid gap-4 sm:gap-6 max-w-4xl mx-auto px-4",
        stats.length === 2 ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {stats.map((stat, index) => (
        <div
          key={index}
          className={cn(
            "group relative rounded-2xl p-6 sm:p-8 text-center border shadow-xl",
            "transform hover:scale-105 hover:-translate-y-1 transition-all duration-300",
            "hover:shadow-2xl hover:shadow-[#6d74b5]/20",
            variants[variant]
          )}
        >
          {/* Glow effect on hover */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#6d74b5]/0 to-[#1c2942]/0 group-hover:from-[#6d74b5]/5 group-hover:to-[#1c2942]/5 transition-all duration-300" />

          <div className="relative">
            {stat.icon && (
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[#1c2942]/10 flex items-center justify-center">
                {stat.icon}
              </div>
            )}
            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-2 sm:mb-3 bg-gradient-to-r from-[#6d74b5] to-[#1c2942] bg-clip-text text-transparent">
              {stat.value}
            </div>
            <div className="text-[#1c2942]/80 font-medium text-sm sm:text-base">
              {stat.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
