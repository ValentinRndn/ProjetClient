import { cn } from "@/lib/utils";
import React from "react";

export interface HeroBannerProps {
  title: React.ReactNode;
  subtitle?: string;
  description?: string;
  badge?: string;
  backgroundImage?: string;
  children?: React.ReactNode;
  className?: string;
}

export function HeroBanner({
  title,
  subtitle,
  description,
  badge,
  backgroundImage,
  children,
  className,
}: HeroBannerProps) {
  return (
    <section
      className={cn(
        "relative bg-linear-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-28 overflow-hidden",
        className
      )}
    >
      {backgroundImage && (
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt="Hero background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-liner-to-br from-blue-900/50 via-blue-800/40 to-indigo-900/30"></div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          {badge && (
            <div className="inline-flex items-center bg-white/20 backdrop-blur-md rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 border border-white/30 shadow-lg">
              <span className="text-xs sm:text-sm font-semibold">{badge}</span>
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold mb-6 sm:mb-8 leading-tight px-4 relative">
            {title}
          </h1>
          {subtitle && (
            <div className="relative inline-block mb-4">{subtitle}</div>
          )}
          {description && (
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
              {description}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
