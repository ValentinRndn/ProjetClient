import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CTAButtonProps {
  onClick?: () => void;
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "md" | "lg" | "xl";
  className?: string;
  icon?: React.ReactNode;
  showArrow?: boolean;
}

export function CTAButton({
  onClick,
  href,
  children,
  variant = "primary",
  size = "lg",
  className,
  icon,
  showArrow = true,
}: CTAButtonProps) {
  const baseClasses = cn(
    "relative group inline-flex items-center justify-center gap-2.5",
    "font-semibold rounded-full",
    "transition-all duration-300 ease-out",
    "transform hover:scale-[1.02] active:scale-[0.98]",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/50"
  );

  const variants = {
    primary: cn(
      "bg-white text-indigo-900",
      "hover:bg-indigo-50 hover:shadow-2xl hover:shadow-white/25",
      "shadow-xl"
    ),
    secondary: cn(
      "bg-white/10 backdrop-blur-xl text-white border border-white/20",
      "hover:bg-white/20 hover:border-white/30 hover:shadow-xl hover:shadow-indigo-500/20"
    ),
    outline: cn(
      "bg-transparent text-white border-2 border-white/50",
      "hover:bg-white/10 hover:border-white"
    ),
  };

  const sizes = {
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
    xl: "px-9 py-4 text-lg",
  };

  const content = (
    <>
      {/* Shimmer effect for primary */}
      {variant === "primary" && (
        <span className="absolute inset-0 rounded-full overflow-hidden">
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-indigo-200/50 to-transparent" />
        </span>
      )}

      <span className="relative flex items-center gap-2.5">
        {icon}
        {children}
        {showArrow && variant === "primary" && (
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        )}
        {variant === "secondary" && (
          <Sparkles className="w-4 h-4 opacity-70" />
        )}
      </span>
    </>
  );

  const combinedClasses = cn(baseClasses, variants[variant], sizes[size], className);

  if (href) {
    return (
      <a href={href} className={combinedClasses}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={combinedClasses}>
      {content}
    </button>
  );
}
