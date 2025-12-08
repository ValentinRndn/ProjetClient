import React from "react";
import { AlertCircle, X } from "lucide-react";

/**
 * Composant pour afficher les erreurs API de manière uniforme
 * @param {Object} props
 * @param {string|Error} [props.error] - Message d'erreur ou objet Error
 * @param {Function} [props.onClose] - Fonction appelée lors de la fermeture
 * @param {string} [props.className] - Classes CSS supplémentaires
 */
export default function ErrorMessage({ error, onClose, className = "" }) {
  if (!error) return null;

  // Gérer différents formats d'erreur
  let errorMessage = "Une erreur est survenue";

  if (typeof error === "string") {
    errorMessage = error;
  } else if (error.message) {
    errorMessage = error.message;
  } else if (error.response?.data?.message) {
    errorMessage = error.response.data.message;
  } else if (error.data?.message) {
    errorMessage = error.data.message;
  }

  return (
    <div
      className={`bg-red-50 border-l-4 border-red-400 p-4 rounded-md ${className}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className="inline-flex text-red-400 hover:text-red-600 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
