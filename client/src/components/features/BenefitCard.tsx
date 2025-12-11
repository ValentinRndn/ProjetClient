import React from "react";
import { cn } from "@/lib/utils";

export interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  variant?: "default" | "outlined" | "gradient";
}

export function BenefitCard({
  icon,
  title,
  description,
  className,
  variant = "default",
}: BenefitCardProps) {
  const variants = {
    default: "bg-white border border-gray-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5",
    outlined: "bg-white/50 border-2 border-gray-200 hover:border-indigo-400",
    gradient: "bg-gradient-to-br from-white to-indigo-50/50 border border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/10",
  };

  return (
    <div
      className={cn(
        "group relative rounded-2xl p-6 sm:p-8 transition-all duration-300",
        "transform hover:-translate-y-1",
        variants[variant],
        className
      )}
    >
      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-100/0 to-indigo-100/50 rounded-bl-[60px] rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Icon container */}
      <div className="relative mb-5">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-indigo-500/20 transition-all duration-300">
          <div className="text-indigo-600">
            {icon}
          </div>
        </div>
      </div>

      {/* Content */}
      <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900 group-hover:text-indigo-900 transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
        {description}
      </p>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
    </div>
  );
}
