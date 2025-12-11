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
    default: "bg-white/10 border-white/20",
    glass: "bg-white/10 backdrop-blur-xl border-white/20",
    solid: "bg-indigo-800/50 border-indigo-600/30",
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
            "hover:shadow-2xl hover:shadow-indigo-500/20",
            variants[variant]
          )}
        >
          {/* Glow effect on hover */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-400/0 to-purple-400/0 group-hover:from-indigo-400/10 group-hover:to-purple-400/10 transition-all duration-300" />

          <div className="relative">
            {stat.icon && (
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-white/10 flex items-center justify-center">
                {stat.icon}
              </div>
            )}
            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-2 sm:mb-3 bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
              {stat.value}
            </div>
            <div className="text-indigo-100/80 font-medium text-sm sm:text-base">
              {stat.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
