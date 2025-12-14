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
    default: "bg-white border border-gray-100 hover:border-[#6d74b5]/30 hover:shadow-xl hover:shadow-[#6d74b5]/5",
    outlined: "bg-white/50 border-2 border-gray-200 hover:border-[#6d74b5]",
    gradient: "bg-gradient-to-br from-white to-[#ebf2fa]/50 border border-[#6d74b5]/20 hover:shadow-xl hover:shadow-[#6d74b5]/10",
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
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#6d74b5]/0 to-[#6d74b5]/20 rounded-bl-[60px] rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Icon container */}
      <div className="relative mb-5">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#ebf2fa] to-[#6d74b5]/10 flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#6d74b5]/20 transition-all duration-300">
          <div className="text-[#6d74b5]">
            {icon}
          </div>
        </div>
      </div>

      {/* Content */}
      <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-[#1c2942] group-hover:text-[#6d74b5] transition-colors">
        {title}
      </h3>
      <p className="text-[#1c2942]/70 text-sm sm:text-base leading-relaxed">
        {description}
      </p>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-[#6d74b5] to-[#1c2942] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
    </div>
  );
}
