import React from "react";

export interface LogoIconProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LogoIcon({ size = "md", className }: LogoIconProps) {
  const sizes = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };

  return (
    <div
      className={`inline-flex items-center justify-center ${sizes[size]} ${
        className || ""
      }`}
    >
      <img
        src="/logo.png"
        alt="Vizion Academy"
        className={`${sizes[size]} rounded-full object-cover`}
        onError={(e) => {
          // Fallback si l'image n'existe pas
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
          target.parentElement!.innerHTML = `
            <div class="${sizes[size]} bg-indigo-600 rounded-full flex items-center justify-center">
              <span class="text-white font-bold text-xl">V</span>
            </div>
          `;
        }}
      />
    </div>
  );
}
