import React, { useEffect } from 'react';
import { X, Globe } from 'lucide-react';

export default function IntervenantModal({ intervenant, isOpen, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !intervenant) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header avec photo */}
        <div className="relative">
          <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-t-2xl overflow-hidden">
            <img
              src={intervenant.image}
              alt={intervenant.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Bouton fermer */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
          
          {/* Format badge */}
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-3 py-1 bg-white bg-opacity-90 text-indigo-700 text-sm font-semibold rounded-full">
              {intervenant.format}
            </span>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {/* Nom et rôle */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {intervenant.name}
            </h2>
            <p className="text-indigo-600 font-medium">
              Intervenant expert
            </p>
          </div>

          {/* Thématiques */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
              Domaines d'expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {intervenant.themes.map((theme, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>

          {/* Langues parlées */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center">
              <Globe className="w-4 h-4 mr-2 text-green-600" />
              Langues parlées
            </h3>
            <div className="flex flex-wrap gap-2">
              {intervenant.languages.map((language, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>

          {/* Villes d'intervention */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Zones d'intervention
            </h3>
            <p className="text-gray-700">
              {intervenant.cities.join(', ')}
            </p>
          </div>

          {/* Bouton d'action */}
          <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-xl">
            Contacter cet intervenant
          </button>
        </div>
      </div>
    </div>
  );
}