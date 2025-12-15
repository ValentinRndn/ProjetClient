/**
 * Page de gestion des disponibilités de l'intervenant
 */
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getIntervenantById, updateIntervenant } from "@/services/intervenants";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import {
  Calendar,
  Clock,
  Save,
  ArrowLeft,
  CheckCircle,
  XCircle,
  CalendarOff,
  CalendarCheck,
  Info,
} from "lucide-react";
import { Link } from "react-router";

interface Disponibility {
  isAvailable: boolean;
  unavailableUntil?: string;
  notes?: string;
}

export default function DisponibilitesPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [isAvailable, setIsAvailable] = useState(true);
  const [unavailableUntil, setUnavailableUntil] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchIntervenant();
  }, [user]);

  const fetchIntervenant = async () => {
    if (!user?.intervenant?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await getIntervenantById(user.intervenant.id);

      const disponibility = data.disponibility as Disponibility | null;
      if (disponibility) {
        setIsAvailable(disponibility.isAvailable ?? true);
        setUnavailableUntil(disponibility.unavailableUntil || "");
        setNotes(disponibility.notes || "");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors du chargement";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.intervenant?.id) return;

    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      const disponibility: Disponibility = {
        isAvailable,
        unavailableUntil: !isAvailable && unavailableUntil ? unavailableUntil : undefined,
        notes: notes || undefined,
      };

      await updateIntervenant(user.intervenant.id, {
        disponibility,
      });

      setSuccess("Disponibilités mises à jour avec succès !");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la sauvegarde";
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDaysUntilAvailable = () => {
    if (!unavailableUntil) return null;
    const endDate = new Date(unavailableUntil);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (isLoading) {
    return (
      <div style={{ backgroundColor: "#ebf2fa", minHeight: "100vh" }}>
        <div style={{ backgroundColor: "#1c2942", minHeight: "150px" }} className="flex items-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
            <div className="h-4 w-32 rounded mb-3" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: "#6d74b5" }}></div>
              <div>
                <div className="h-6 w-48 rounded mb-2" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}></div>
                <div className="h-4 w-64 rounded" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse space-y-6">
            <div className="rounded-xl p-8" style={{ backgroundColor: "#ffffff" }}>
              <div className="h-24 rounded-xl" style={{ backgroundColor: "#ebf2fa" }}></div>
            </div>
            <div className="rounded-xl p-8" style={{ backgroundColor: "#ffffff" }}>
              <div className="h-24 rounded-xl" style={{ backgroundColor: "#ebf2fa" }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const daysUntilAvailable = getDaysUntilAvailable();

  return (
    <div style={{ backgroundColor: "#ebf2fa", minHeight: "100vh" }}>
      {/* Header avec bannière */}
      <div style={{ backgroundColor: "#1c2942", minHeight: "150px" }} className="flex items-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
          <Link
            to="/dashboard/intervenant"
            className="inline-flex items-center gap-2 text-sm mb-3 transition-colors hover:opacity-80"
            style={{ color: "rgba(235, 242, 250, 0.7)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au tableau de bord
          </Link>

          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#6d74b5" }}
            >
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Mes Disponibilités</h1>
              <p className="text-sm" style={{ color: "rgba(235, 242, 250, 0.7)" }}>
                Indiquez aux écoles si vous êtes disponible
              </p>
            </div>
          </div>

          {/* Stats inline */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-white/20">
            <div
              className="px-3 py-1.5 rounded-lg"
              style={{
                backgroundColor: isAvailable
                  ? "rgba(16, 185, 129, 0.2)"
                  : "rgba(251, 191, 36, 0.2)"
              }}
            >
              {isAvailable ? (
                <CalendarCheck className="w-4 h-4 inline mr-2" style={{ color: "#10b981" }} />
              ) : (
                <CalendarOff className="w-4 h-4 inline mr-2" style={{ color: "#fbbf24" }} />
              )}
              <span
                className="font-bold"
                style={{ color: isAvailable ? "#10b981" : "#fbbf24" }}
              >
                {isAvailable ? "Disponible" : "Indisponible"}
              </span>
            </div>
            {!isAvailable && daysUntilAvailable !== null && daysUntilAvailable > 0 && (
              <div
                className="px-3 py-1.5 rounded-lg"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              >
                <Clock className="w-4 h-4 inline mr-2" style={{ color: "rgba(235, 242, 250, 0.7)" }} />
                <span className="font-bold text-white">{daysUntilAvailable}</span>
                <span className="text-sm ml-2" style={{ color: "rgba(235, 242, 250, 0.7)" }}>
                  jour{daysUntilAvailable > 1 ? "s" : ""} restant{daysUntilAvailable > 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6">
            <Alert type="error" onClose={() => setError(null)}>{error}</Alert>
          </div>
        )}

        {success && (
          <div className="mb-6">
            <Alert type="success" onClose={() => setSuccess(null)}>{success}</Alert>
          </div>
        )}

        {/* Info box */}
        <div
          className="rounded-xl p-4 mb-6"
          style={{ backgroundColor: "rgba(109, 116, 181, 0.1)", border: "1px solid rgba(109, 116, 181, 0.2)" }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#ebf2fa" }}
            >
              <Info className="w-5 h-5" style={{ color: "#6d74b5" }} />
            </div>
            <div>
              <h3 className="font-bold mb-1" style={{ color: "#1c2942" }}>
                À quoi servent les disponibilités ?
              </h3>
              <p className="text-sm" style={{ color: "#6d74b5" }}>
                Les écoles peuvent voir votre statut de disponibilité sur votre profil.
                Si vous êtes indisponible, la date de fin sera affichée pour qu'elles puissent
                vous contacter au bon moment.
              </p>
            </div>
          </div>
        </div>

        {/* Statut actuel */}
        <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: "#ffffff" }}>
          <h2 className="text-xl font-bold mb-6" style={{ color: "#1c2942" }}>Statut actuel</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Option Disponible */}
            <button
              type="button"
              onClick={() => setIsAvailable(true)}
              className="p-6 rounded-xl text-left transition-all"
              style={{
                border: isAvailable ? "2px solid #10b981" : "2px solid #ebf2fa",
                backgroundColor: isAvailable ? "#ecfdf5" : "#ffffff"
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: isAvailable ? "#10b981" : "#ebf2fa",
                    color: isAvailable ? "#ffffff" : "#6d74b5"
                  }}
                >
                  <CalendarCheck className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: "#1c2942" }}>Disponible</h3>
                  <p className="text-sm" style={{ color: "#6d74b5" }}>Je suis ouvert aux nouvelles missions</p>
                </div>
              </div>
              {isAvailable && (
                <div className="mt-4 flex items-center gap-2" style={{ color: "#10b981" }}>
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Statut actif</span>
                </div>
              )}
            </button>

            {/* Option Indisponible */}
            <button
              type="button"
              onClick={() => setIsAvailable(false)}
              className="p-6 rounded-xl text-left transition-all"
              style={{
                border: !isAvailable ? "2px solid #f59e0b" : "2px solid #ebf2fa",
                backgroundColor: !isAvailable ? "#fffbeb" : "#ffffff"
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: !isAvailable ? "#f59e0b" : "#ebf2fa",
                    color: !isAvailable ? "#ffffff" : "#6d74b5"
                  }}
                >
                  <CalendarOff className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: "#1c2942" }}>Indisponible</h3>
                  <p className="text-sm" style={{ color: "#6d74b5" }}>Je ne prends pas de missions actuellement</p>
                </div>
              </div>
              {!isAvailable && (
                <div className="mt-4 flex items-center gap-2" style={{ color: "#f59e0b" }}>
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">Statut actif</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Date de fin d'indisponibilité */}
        {!isAvailable && (
          <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: "#ffffff" }}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: "#1c2942" }}>
              <Clock className="w-5 h-5" style={{ color: "#f59e0b" }} />
              Jusqu'à quand êtes-vous indisponible ?
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#1c2942" }}>
                  Date de retour de disponibilité
                </label>
                <input
                  type="date"
                  value={unavailableUntil}
                  onChange={(e) => setUnavailableUntil(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all"
                  style={{ borderColor: "#ebf2fa" }}
                />
                {unavailableUntil && (
                  <p className="text-sm mt-2" style={{ color: "#6d74b5" }}>
                    Vous serez affiché comme disponible à partir du{" "}
                    <span className="font-medium" style={{ color: "#f59e0b" }}>
                      {formatDate(unavailableUntil)}
                    </span>
                  </p>
                )}
              </div>

              {daysUntilAvailable !== null && daysUntilAvailable > 0 && (
                <div
                  className="rounded-xl p-4"
                  style={{ backgroundColor: "#fffbeb", border: "1px solid #fcd34d" }}
                >
                  <p style={{ color: "#92400e" }}>
                    <span className="font-bold text-2xl">{daysUntilAvailable}</span>
                    <span className="ml-2">
                      jour{daysUntilAvailable > 1 ? "s" : ""} d'indisponibilité restant{daysUntilAvailable > 1 ? "s" : ""}
                    </span>
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#1c2942" }}>
                  Note (optionnelle)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Ex: En formation jusqu'au 15 janvier, disponible pour des missions courtes à partir de cette date."
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all resize-none"
                  style={{ borderColor: "#ebf2fa" }}
                />
                <p className="text-sm mt-1" style={{ color: "#6d74b5" }}>
                  Cette note sera visible par les écoles sur votre profil
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bouton de sauvegarde */}
        <div
          className="flex justify-end rounded-xl p-6"
          style={{ backgroundColor: "#ffffff" }}
        >
          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="lg"
            className="bg-[#6d74b5] hover:bg-[#5a61a0]"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sauvegarde...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-5 h-5" />
                Sauvegarder mes disponibilités
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
