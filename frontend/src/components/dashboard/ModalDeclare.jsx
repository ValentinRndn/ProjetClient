import React, { useState } from "react";
import { X, Calendar, Building, FileText, CheckCircle } from "lucide-react";
import * as ecoleService from "../../services/ecoleService";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorMessage from "../common/ErrorMessage";

/**
 * ModalDeclare - Modal pour déclarer une nouvelle collaboration
 * Formulaire court avec école, date, résumé
 *
 * @param {boolean} isOpen - État d'ouverture du modal
 * @param {Function} onClose - Callback pour fermer le modal
 * @param {string} [ecoleId] - ID de l'école (optionnel, sera récupéré automatiquement si non fourni)
 */
export default function ModalDeclare({ isOpen, onClose, ecoleId }) {
  const [formData, setFormData] = useState({
    school: "",
    startDate: "",
    endDate: "",
    module: "",
    summary: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!ecoleId) {
        throw new Error("ID de l'école non disponible");
      }

      // Préparer les données pour l'API
      const missionData = {
        title:
          formData.module ||
          formData.summary?.substring(0, 100) ||
          "Mission sans titre",
        description: formData.summary || "",
        startDate: formData.startDate
          ? new Date(formData.startDate).toISOString()
          : null,
        endDate: formData.endDate
          ? new Date(formData.endDate).toISOString()
          : null,
        status: "ACTIVE",
        priceCents: 0, // À adapter selon les besoins
      };

      // Appeler l'API pour déclarer la mission
      await ecoleService.declareMission(ecoleId, missionData);

      setSubmitted(true);

      // Reset après 2s
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          school: "",
          startDate: "",
          endDate: "",
          module: "",
          summary: "",
        });
        onClose();
        // Recharger la page pour afficher la nouvelle mission
        window.location.reload();
      }, 2000);
    } catch (err) {
      const errorMsg =
        err.message ||
        err.response?.data?.message ||
        "Impossible de déclarer la collaboration. Veuillez réessayer.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 id="modal-title" className="text-2xl font-bold text-bleu-nuit">
              Déclarer une collaboration
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Dès que vous validez une mission avec l'école
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Fermer le modal"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4">
              <ErrorMessage error={error} onClose={() => setError(null)} />
            </div>
          )}

          {submitted ? (
            // Success message
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-bleu-nuit mb-2">
                Collaboration déclarée !
              </h3>
              <p className="text-gray-600">
                Votre collaboration a été enregistrée avec succès.
              </p>
            </div>
          ) : (
            // Form
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* École */}
              <div>
                <label className="flex items-center gap-2 font-semibold text-bleu-nuit mb-2">
                  <Building size={18} className="text-indigo-violet" />
                  École partenaire
                </label>
                <input
                  type="text"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  placeholder="Ex: ESSEC Business School"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-violet focus:outline-none transition-colors text-bleu-nuit"
                  required
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 font-semibold text-bleu-nuit mb-2">
                    <Calendar size={18} className="text-indigo-violet" />
                    Date de début
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-violet focus:outline-none transition-colors text-bleu-nuit"
                    required
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 font-semibold text-bleu-nuit mb-2">
                    <Calendar size={18} className="text-indigo-violet" />
                    Date de fin
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-violet focus:outline-none transition-colors text-bleu-nuit"
                    required
                  />
                </div>
              </div>

              {/* Module */}
              <div>
                <label className="flex items-center gap-2 font-semibold text-bleu-nuit mb-2">
                  <FileText size={18} className="text-indigo-violet" />
                  Intitulé du module
                </label>
                <input
                  type="text"
                  name="module"
                  value={formData.module}
                  onChange={handleChange}
                  placeholder="Ex: Marketing Digital et Stratégie"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-violet focus:outline-none transition-colors text-bleu-nuit"
                  required
                />
              </div>

              {/* Résumé */}
              <div>
                <label className="font-semibold text-bleu-nuit mb-2 block">
                  Résumé de la mission
                </label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Décrivez brièvement les objectifs et le contenu de cette intervention..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-violet focus:outline-none transition-colors text-bleu-nuit resize-none"
                  required
                />
              </div>

              {/* Info */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <p className="text-sm text-bleu-nuit">
                  <strong>ℹ️ Information :</strong> Cette déclaration sera
                  vérifiée par notre équipe avant validation définitive.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-bleu-nuit rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-bleu-nuit text-white rounded-lg font-semibold hover:bg-bleu-nuit transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="small" />
                      Envoi en cours...
                    </>
                  ) : (
                    "Valider la déclaration"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
