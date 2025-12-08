import React from "react";
import { Loader2 } from "lucide-react";

/**
 * Composant de chargement réutilisable
 * @param {Object} props
 * @param {string} [props.size] - Taille du spinner (small, medium, large)
 * @param {string} [props.message] - Message à afficher sous le spinner
 * @param {string} [props.className] - Classes CSS supplémentaires
 */
export default function LoadingSpinner({
  size = "medium",
  message,
  className = "",
}) {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  const textSizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2
        className={`${sizeClasses[size]} animate-spin text-indigo-violet`}
      />
      {message && (
        <p className={`mt-2 text-gray-600 ${textSizeClasses[size]}`}>
          {message}
        </p>
      )}
    </div>
  );
}
