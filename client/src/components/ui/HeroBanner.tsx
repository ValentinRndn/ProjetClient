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
  variant?: "default" | "gradient" | "mesh" | "image";
}

export function HeroBanner({
  title,
  subtitle,
  description,
  badge,
  backgroundImage,
  children,
  className,
  variant = "image",
}: HeroBannerProps) {
  const isImageVariant = variant === "image";

  const variants = {
    default: "bg-[#1c2942]",
    gradient: "bg-gradient-to-br from-[#1c2942] via-[#2a3a5c] to-[#1c2942]",
    mesh: "bg-[#ebf2fa]",
    image: "bg-[#1c2942]",
  };

  // Couleurs du texte selon le variant
  const textColors = {
    default: { title: "text-white", description: "text-white/80", badge: "text-white", badgeBg: "bg-white/10 border-white/20" },
    gradient: { title: "text-white", description: "text-white/80", badge: "text-white", badgeBg: "bg-white/10 border-white/20" },
    mesh: { title: "text-[#1c2942]", description: "text-[#1c2942]/80", badge: "text-[#1c2942]", badgeBg: "bg-[#1c2942]/10 border-[#1c2942]/20" },
    image: { title: "text-white", description: "text-white/80", badge: "text-white", badgeBg: "bg-white/10 border-white/20" },
  };

  const colors = textColors[variant];

  return (
    <section
      className={cn(
        "relative text-white py-20 sm:py-28 lg:py-36 overflow-hidden min-h-[90vh] flex items-center",
        variants[variant],
        className
      )}
    >
      {/* Background Image for image variant */}
      {isImageVariant && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop')`,
            }}
          />
          {/* Gradient Overlay - from blue to pink */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, rgba(28, 41, 66, 0.9) 0%, rgba(109, 116, 181, 0.85) 40%, rgba(219, 186, 207, 0.8) 100%)`,
            }}
          />
        </>
      )}

      {/* Animated Background Elements (only for non-image variants) */}
      {!isImageVariant && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#6d74b5]/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#dbbacf]/30 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-linear-to-r from-[#6d74b5]/10 to-[#dbbacf]/10 rounded-full blur-3xl" />

          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(#1c2942 1px, transparent 1px), linear-gradient(90deg, #1c2942 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>
      )}

      {backgroundImage && !isImageVariant && (
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
            <div className={cn(
              "inline-flex items-center gap-2 backdrop-blur-xl rounded-full px-5 py-2.5 mb-8 border shadow-xl animate-fade-in-up",
              colors.badgeBg
            )}>
              <div className="w-2 h-2 bg-[#6d74b5] rounded-full animate-pulse" />
              <span className={cn("text-sm font-medium", colors.badge)}>{badge}</span>
            </div>
          )}

          <h1
            className={cn(
              "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 sm:mb-8 leading-[1.1] tracking-tight animate-fade-in-up stagger-1",
              colors.title
            )}
          >
            {title}
          </h1>

          {subtitle && (
            <div className={cn("relative inline-block mb-4 animate-fade-in-up stagger-2", colors.title)}>
              {subtitle}
            </div>
          )}

          {description && (
            <p
              className={cn(
                "text-lg sm:text-xl md:text-2xl mb-10 sm:mb-14 max-w-3xl mx-auto leading-relaxed animate-fade-in-up stagger-2",
                colors.description
              )}
            >
              {description}
            </p>
          )}
        </div>

        <div className="animate-fade-in-up stagger-3">
          {children}
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t to-transparent",
        isImageVariant ? "from-[#1c2942]/50" : "from-white"
      )} />
    </section>
  );
}
