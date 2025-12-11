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
  variant?: "default" | "gradient" | "mesh";
}

export function HeroBanner({
  title,
  subtitle,
  description,
  badge,
  backgroundImage,
  children,
  className,
  variant = "mesh",
}: HeroBannerProps) {
  const variants = {
    default: "bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900",
    gradient: "bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900",
    mesh: "bg-gradient-mesh",
  };

  return (
    <section
      className={cn(
        "relative text-white py-20 sm:py-28 lg:py-36 overflow-hidden min-h-[90vh] flex items-center",
        variants[variant],
        className
      )}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-3xl" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {backgroundImage && (
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt="Hero background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/80 via-indigo-900/70 to-purple-900/80" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="text-center mb-8 sm:mb-12">
          {badge && (
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-full px-5 py-2.5 mb-8 border border-white/20 shadow-xl animate-fade-in-up">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-indigo-100">{badge}</span>
            </div>
          )}

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 sm:mb-8 leading-[1.1] tracking-tight animate-fade-in-up stagger-1">
            {title}
          </h1>

          {subtitle && (
            <div className="relative inline-block mb-4 animate-fade-in-up stagger-2">
              {subtitle}
            </div>
          )}

          {description && (
            <p className="text-lg sm:text-xl md:text-2xl text-indigo-100/90 mb-10 sm:mb-14 max-w-3xl mx-auto leading-relaxed animate-fade-in-up stagger-2">
              {description}
            </p>
          )}
        </div>

        <div className="animate-fade-in-up stagger-3">
          {children}
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent" />
    </section>
  );
}
