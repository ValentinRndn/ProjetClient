import React from "react";
import { cn } from "@/lib/utils";

export interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function BenefitCard({
  icon,
  title,
  description,
  className,
}: BenefitCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all border border-blue-100 hover:border-indigo-600 transform hover:-translate-y-2 group",
        className
      )}
    >
      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-gray-50 rounded-xl inline-block group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900">
        {title}
      </h3>
      <p className="text-gray-600 text-sm sm:text-base">{description}</p>
    </div>
  );
}
