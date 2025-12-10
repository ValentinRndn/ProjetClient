import { Button } from "./Button";
import { ArrowRight } from "lucide-react";

export interface CTAButtonProps {
  onClick?: () => void;
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export function CTAButton({
  onClick,
  href,
  children,
  variant = "primary",
  className,
}: CTAButtonProps) {
  const baseClasses =
    "px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-2xl hover:shadow-3xl text-sm sm:text-base flex items-center gap-2 justify-center";

  if (href) {
    return (
      <a
        href={href}
        className={`${baseClasses} ${
          variant === "primary"
            ? "bg-white text-blue-800 hover:bg-blue-50"
            : "bg-indigo-700 backdrop-blur-sm text-white hover:bg-blue-700 border border-white/20"
        } ${className || ""}`}
      >
        {children}
        {variant === "primary" && <ArrowRight className="w-4 h-4" />}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${
        variant === "primary"
          ? "bg-white text-blue-800 hover:bg-blue-50"
          : "bg-indigo-700 backdrop-blur-sm text-white hover:bg-blue-700 border border-white/20"
      } ${className || ""}`}
    >
      {children}
      {variant === "primary" && <ArrowRight className="w-4 h-4" />}
    </button>
  );
}
