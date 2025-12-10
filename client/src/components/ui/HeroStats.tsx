import React from "react";

export interface Stat {
  value: string;
  label: string;
}

export interface HeroStatsProps {
  stats: Stat[];
  className?: string;
}

export function HeroStats({ stats, className }: HeroStatsProps) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto px-4 ${
        className || ""
      }`}
    >
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white/15 backdrop-blur-xl rounded-2xl p-6 sm:p-8 text-center border border-white/30 shadow-2xl transform hover:scale-105 transition-all"
        >
          <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-2 sm:mb-3 text-yellow-300">
            {stat.value}
          </div>
          <div className="text-blue-100 font-medium text-sm sm:text-base">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
