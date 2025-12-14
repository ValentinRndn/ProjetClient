/**
 * Page de gestion des disponibilités de l'intervenant
 */
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getIntervenantById, updateIntervenant } from "@/services/intervenants";
import { PageContainer } from "@/components/ui/PageContainer";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { motion } from "motion/react";
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
  unavailableUntil?: string; // ISO date string
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

      // Parse disponibility from JSON
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

  // Calculer le nombre de jours restants d'indisponibilité
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
      <div className="min-h-screen bg-gray-50 py-12">
        <PageContainer maxWidth="2xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="bg-white rounded-2xl p-8 space-y-4">
              <div className="h-24 bg-gray-200 rounded-xl"></div>
              <div className="h-24 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </PageContainer>
      </div>
    );
  }

  const daysUntilAvailable = getDaysUntilAvailable();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-mesh">
        <PageContainer maxWidth="2xl" className="py-8">
          <Link
            to="/dashboard/intervenant"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au tableau de bord
          </Link>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Calendar className="w-8 h-8" />
            Gestion des disponibilités
          </h1>
          <p className="text-white/80 mt-2">
            Indiquez aux écoles si vous êtes disponible pour de nouvelles missions
          </p>
        </PageContainer>
      </div>

      <PageContainer maxWidth="2xl" className="py-8 -mt-8">
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Alert type="error" onClose={() => setError(null)}>{error}</Alert>
          </motion.div>
        )}

        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Alert type="success" onClose={() => setSuccess(null)}>{success}</Alert>
          </motion.div>
        )}

        {/* Info box */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
              <Info className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 mb-1">À quoi servent les disponibilités ?</h3>
              <p className="text-blue-700 text-sm">
                Les écoles peuvent voir votre statut de disponibilité sur votre profil.
                Si vous êtes indisponible, la date de fin sera affichée pour qu'elles puissent
                vous contacter au bon moment.
              </p>
            </div>
          </div>
        </div>

        {/* Status actuel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Statut actuel</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Option Disponible */}
            <button
              type="button"
              onClick={() => setIsAvailable(true)}
              className={`p-6 rounded-2xl border-2 transition-all text-left ${
                isAvailable
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  isAvailable ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400"
                }`}>
                  <CalendarCheck className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Disponible</h3>
                  <p className="text-gray-500 text-sm">Je suis ouvert aux nouvelles missions</p>
                </div>
              </div>
              {isAvailable && (
                <div className="mt-4 flex items-center gap-2 text-emerald-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Statut actif</span>
                </div>
              )}
            </button>

            {/* Option Indisponible */}
            <button
              type="button"
              onClick={() => setIsAvailable(false)}
              className={`p-6 rounded-2xl border-2 transition-all text-left ${
                !isAvailable
                  ? "border-amber-500 bg-amber-50"
                  : "border-gray-200 hover:border-amber-300 hover:bg-amber-50/50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  !isAvailable ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-400"
                }`}>
                  <CalendarOff className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Indisponible</h3>
                  <p className="text-gray-500 text-sm">Je ne prends pas de missions actuellement</p>
                </div>
              </div>
              {!isAvailable && (
                <div className="mt-4 flex items-center gap-2 text-amber-600">
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">Statut actif</span>
                </div>
              )}
            </button>
          </div>
        </motion.div>

        {/* Date de fin d'indisponibilité */}
        {!isAvailable && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              Jusqu'à quand êtes-vous indisponible ?
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de retour de disponibilité
                </label>
                <input
                  type="date"
                  value={unavailableUntil}
                  onChange={(e) => setUnavailableUntil(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
                {unavailableUntil && (
                  <p className="text-sm text-gray-500 mt-2">
                    Vous serez affiché comme disponible à partir du{" "}
                    <span className="font-medium text-amber-600">
                      {formatDate(unavailableUntil)}
                    </span>
                  </p>
                )}
              </div>

              {daysUntilAvailable !== null && daysUntilAvailable > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-amber-800">
                    <span className="font-bold text-2xl">{daysUntilAvailable}</span>
                    <span className="ml-2">jour{daysUntilAvailable > 1 ? "s" : ""} d'indisponibilité restant{daysUntilAvailable > 1 ? "s" : ""}</span>
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note (optionnelle)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Ex: En formation jusqu'au 15 janvier, disponible pour des missions courtes à partir de cette date."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
                />
                <p className="text-sm text-gray-400 mt-1">
                  Cette note sera visible par les écoles sur votre profil
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Bouton de sauvegarde */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-end"
        >
          <Button onClick={handleSave} disabled={isSaving} size="lg">
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
        </motion.div>
      </PageContainer>
    </div>
  );
}
