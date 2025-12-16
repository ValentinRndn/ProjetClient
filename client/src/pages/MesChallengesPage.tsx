/**
 * Page de gestion des challenges pour les intervenants
 */
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import {
  getMyChallenges,
  deleteChallenge,
  type Challenge,
} from "@/services/challenges";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import {
  Trophy,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  ArrowLeft,
  Eye,
  Users,
  Calendar,
} from "lucide-react";

export default function MesChallengesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      setIsLoading(true);
      const data = await getMyChallenges();
      setChallenges(data);
    } catch (err) {
      setError("Erreur lors du chargement des challenges");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce challenge ?")) {
      return;
    }

    try {
      await deleteChallenge(id);
      setChallenges(challenges.filter((c) => c.id !== id));
      setSuccessMessage("Challenge supprimé avec succès");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Erreur lors de la suppression");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
            <CheckCircle className="w-3.5 h-3.5" />
            Approuvé
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            <Clock className="w-3.5 h-3.5" />
            En attente
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <XCircle className="w-3.5 h-3.5" />
            Refusé
          </span>
        );
      default:
        return null;
    }
  };

  const pendingCount = challenges.filter((c) => c.status === "pending").length;
  const approvedCount = challenges.filter((c) => c.status === "approved").length;
  const rejectedCount = challenges.filter((c) => c.status === "rejected").length;

  return (
    <div style={{ backgroundColor: "#ebf2fa", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{ backgroundColor: "#1c2942", minHeight: "150px" }}
        className="flex items-center"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
          <Link
            to="/dashboard/intervenant"
            className="inline-flex items-center gap-2 text-sm mb-3 transition-colors hover:opacity-80"
            style={{ color: "rgba(235, 242, 250, 0.7)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au dashboard
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "#dbbacf" }}
              >
                <Trophy className="w-6 h-6 text-[#28303a]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Mes Challenges</h1>
                <p className="text-sm" style={{ color: "rgba(235, 242, 250, 0.7)" }}>
                  Créez et gérez vos challenges pédagogiques
                </p>
              </div>
            </div>

            <Button
              onClick={() => navigate("/challenges/nouveau")}
              className="bg-[#dbbacf] hover:bg-[#c9a3bd] text-[#28303a]"
            >
              <Plus className="w-4 h-4" />
              Créer un challenge
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1c2942]">{pendingCount}</p>
                <p className="text-sm text-[#1c2942]/60">En attente</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1c2942]">{approvedCount}</p>
                <p className="text-sm text-[#1c2942]/60">Approuvés</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1c2942]">{rejectedCount}</p>
                <p className="text-sm text-[#1c2942]/60">Refusés</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <Alert type="error" className="mb-6" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert type="success" className="mb-6" onClose={() => setSuccessMessage(null)}>
            {successMessage}
          </Alert>
        )}

        {/* Liste des challenges */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : challenges.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <div className="w-16 h-16 bg-[#ebf2fa] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-[#6d74b5]" />
            </div>
            <h3 className="text-lg font-semibold text-[#1c2942] mb-2">
              Aucun challenge créé
            </h3>
            <p className="text-[#1c2942]/60 mb-6">
              Créez votre premier challenge pédagogique pour le proposer aux écoles.
            </p>
            <Button
              onClick={() => navigate("/challenges/nouveau")}
              className="bg-[#6d74b5] hover:bg-[#5a61a0]"
            >
              <Plus className="w-4 h-4" />
              Créer mon premier challenge
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-[#1c2942] mb-2 line-clamp-2">
                      {challenge.title}
                    </h3>
                    {getStatusBadge(challenge.status)}
                  </div>
                </div>

                {/* Thématique */}
                <div className="mb-4">
                  <span className="px-3 py-1 bg-[#ebf2fa] text-[#6d74b5] rounded-full text-xs font-medium">
                    {challenge.thematique}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-[#1c2942]/70 mb-4 line-clamp-3">
                  {challenge.shortDescription || challenge.description}
                </p>

                {/* Raison du refus */}
                {challenge.status === "rejected" && challenge.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-xs font-medium text-red-700 mb-1">Raison du refus :</p>
                    <p className="text-sm text-red-600">{challenge.rejectionReason}</p>
                  </div>
                )}

                {/* Infos */}
                <div className="space-y-2 mb-4 text-sm text-[#1c2942]/60">
                  {challenge.duration && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{challenge.duration}</span>
                    </div>
                  )}
                  {challenge.targetAudience && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{challenge.targetAudience}</span>
                    </div>
                  )}
                </div>

                {/* Date */}
                <div className="text-xs text-[#1c2942]/40 mb-4">
                  Créé le{" "}
                  {new Date(challenge.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-[#1c2942]/10 flex gap-2">
                  {challenge.status === "approved" && (
                    <Link
                      to={`/tous-les-challenges/${challenge.id}`}
                      className="flex-1"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="w-4 h-4" />
                        Voir
                      </Button>
                    </Link>
                  )}
                  {challenge.status !== "approved" && (
                    <>
                      <Link
                        to={`/challenges/${challenge.id}/modifier`}
                        className="flex-1"
                      >
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="w-4 h-4" />
                          Modifier
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(challenge.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
