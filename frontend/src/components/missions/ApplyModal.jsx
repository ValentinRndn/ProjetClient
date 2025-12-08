import React, { useState } from "react";
import { X, Send, CheckCircle } from "lucide-react";
import * as missionService from "../../services/missionService";
import * as authService from "../../services/authService";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorMessage from "../common/ErrorMessage";

/**
 * ApplyModal - Modal pour postuler à une mission
 * Formulaire simple avec message de motivation
 *
 * @param {boolean} isOpen - État d'ouverture
 * @param {Function} onClose - Callback de fermeture
 * @param {Object} mission - Objet mission
 */
export default function ApplyModal({ isOpen, onClose, mission }) {
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      // Récupérer l'utilisateur connecté pour obtenir l'ID de l'intervenant
      const userResponse = await authService.getCurrentUser();
      const user = userResponse.user;

      if (!user || user.role !== "INTERVENANT" || !user.intervenant) {
        throw new Error(
          "Vous devez être un intervenant validé pour postuler à une mission."
        );
      }

      // Pour l'instant, on ne fait que simuler (l'API n'a pas d'endpoint spécifique pour postuler)
      // On pourrait utiliser assignIntervenant mais cela assigne directement
      // Pour un MVP, on simule l'envoi
      console.log("Candidature envoyée:", {
        missionId: mission.id,
        intervenantId: user.intervenant.id,
        message,
      });

      // TODO: Créer un endpoint POST /missions/:id/apply pour les candidatures
      // Pour l'instant, simulation
      setSubmitted(true);

      // Reset et fermeture après 2s
      setTimeout(() => {
        setSubmitted(false);
        setMessage("");
        onClose();
      }, 2000);
    } catch (err) {
      const errorMsg =
        err.message ||
        err.response?.data?.message ||
        "Impossible d'envoyer votre candidature. Veuillez réessayer.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-modal-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2
              id="apply-modal-title"
              className="text-2xl font-bold text-bleu-nuit"
            >
              Postuler à cette mission
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {mission.title} • {mission.school}
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
          {submitted ? (
            // Success message
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-bleu-nuit mb-2">
                Candidature envoyée !
              </h3>
              <p className="text-gray-600">
                L'école partenaire a été notifiée de votre intérêt pour cette
                mission.
              </p>
            </div>
          ) : (
            // Form
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Récap mission */}
              <div className="bg-muted rounded-xl p-6 border border-gray-200">
                <h3 className="font-bold text-bleu-nuit mb-3">
                  Récapitulatif de la mission
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">École</p>
                    <p className="font-semibold text-bleu-nuit">
                      {mission.school}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Taux horaire</p>
                    <p className="font-semibold text-bleu-nuit">
                      {mission.hourlyRate}€/h
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Volume</p>
                    <p className="font-semibold text-bleu-nuit">
                      {mission.volume || 0}h
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Montant total</p>
                    <p className="font-semibold text-bleu-nuit">
                      {mission.totalAmount.toLocaleString()}€
                    </p>
                  </div>
                </div>
              </div>

              {/* Message de motivation */}
              <div>
                <label className="font-semibold text-bleu-nuit mb-2 block">
                  Message de motivation
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  placeholder="Présentez brièvement votre profil, votre expérience et votre motivation pour cette mission..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-violet focus:outline-none transition-colors text-bleu-nuit resize-none"
                  required
                />
              </div>

              {/* Info */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <p className="text-sm text-bleu-nuit">
                  <strong>ℹ️ Information :</strong> Votre candidature sera
                  étudiée par l'école partenaire. Vous recevrez une réponse sous
                  48h.
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
                  className="flex-1 px-6 py-3 bg-bleu-nuit text-white rounded-lg font-semibold hover:bg-bleu-nuit transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="small" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Envoyer ma candidature
                    </>
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
