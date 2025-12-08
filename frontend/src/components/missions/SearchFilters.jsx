import React from "react";
import { Search, Filter } from "lucide-react";

/**
 * SearchFilters - Barre de recherche et filtres pour le mur des missions
 *
 * @param {string} searchTerm - Terme de recherche
 * @param {Function} onSearchChange - Callback changement recherche
 * @param {string} schoolFilter - École sélectionnée
 * @param {Function} onSchoolChange - Callback changement école
 * @param {number} rateFilterIndex - Index tranche de taux sélectionnée
 * @param {Function} onRateChange - Callback changement taux
 * @param {Array} schools - Liste des écoles disponibles
 * @param {Array} rateRanges - Liste des tranches de taux
 * @param {number} resultsCount - Nombre de résultats
 */
export default function SearchFilters({
  searchTerm,
  onSearchChange,
  schoolFilter,
  onSchoolChange,
  rateFilterIndex,
  onRateChange,
  statusFilter,
  onStatusChange,
  schools,
  rateRanges,
  resultsCount,
}) {
  const statusOptions = [
    { value: "ACTIVE", label: "Actives" },
    { value: "DRAFT", label: "Brouillons" },
    { value: "COMPLETED", label: "Terminées" },
    { value: "", label: "Tous les statuts" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-violet/10 rounded-xl">
          <Filter size={24} className="text-indigo-violet" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-bleu-nuit">
            Recherche et filtres
          </h3>
          <p className="text-sm text-gray-600">
            Affinez votre recherche de missions
          </p>
        </div>
      </div>

      {/* Recherche et filtres */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Barre de recherche */}
        <div className="md:col-span-1">
          <label className="block text-sm font-semibold text-bleu-nuit mb-2">
            Recherche
          </label>
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-violet focus:outline-none transition-colors text-bleu-nuit"
            />
          </div>
        </div>

        {/* Filtre école */}
        <div>
          <label className="block text-sm font-semibold text-bleu-nuit mb-2">
            École
          </label>
          <select
            value={schoolFilter}
            onChange={(e) => onSchoolChange(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-violet focus:outline-none transition-colors text-bleu-nuit bg-white"
          >
            {schools.map((school, index) => (
              <option key={index} value={school}>
                {school}
              </option>
            ))}
          </select>
        </div>

        {/* Filtre taux */}
        <div>
          <label className="block text-sm font-semibold text-bleu-nuit mb-2">
            Taux horaire
          </label>
          <select
            value={rateFilterIndex}
            onChange={(e) => onRateChange(parseInt(e.target.value))}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-violet focus:outline-none transition-colors text-bleu-nuit bg-white"
          >
            {rateRanges.map((range, index) => (
              <option key={index} value={index}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filtre statut */}
        {onStatusChange && (
          <div>
            <label className="block text-sm font-semibold text-bleu-nuit mb-2">
              Statut
            </label>
            <select
              value={statusFilter || ""}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-violet focus:outline-none transition-colors text-bleu-nuit bg-white"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Indicateur de résultats */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <p className="text-sm font-semibold text-bleu-nuit">
            {resultsCount} mission(s) disponible(s)
          </p>
        </div>

        {/* Reset filters */}
        {(searchTerm ||
          schoolFilter !== "Toutes les écoles" ||
          rateFilterIndex !== 0 ||
          (statusFilter && statusFilter !== "ACTIVE")) && (
          <button
            onClick={() => {
              onSearchChange("");
              onSchoolChange("Toutes les écoles");
              onRateChange(0);
              if (onStatusChange) onStatusChange("ACTIVE");
            }}
            className="text-sm text-indigo-violet hover:text-bleu-nuit font-semibold underline"
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>
    </div>
  );
}
