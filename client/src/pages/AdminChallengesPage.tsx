/**
 * Page admin de gestion des challenges
 */
import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  getAllChallenges,
  getChallengeStats,
  approveChallenge,
  rejectChallenge,
  deleteChallenge,
  THEMATIQUES,
  type Challenge,
  type ChallengeStats,
} from "@/services/challenges";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import {
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
  ArrowLeft,
  Eye,
  Users,
  Calendar,
  Filter,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function AdminChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [stats, setStats] = useState<ChallengeStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [thematiqueFilter, setThematiqueFilter] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [statusFilter, thematiqueFilter]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [challengesData, statsData] = await Promise.all([
        getAllChallenges({
          status: statusFilter || undefined,
          thematique: thematiqueFilter || undefined,
        }),
        getChallengeStats(),
      ]);
      setChallenges(challengesData);
      setStats(statsData);
    } catch (err) {
      setError("Erreur lors du chargement des challenges");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir approuver ce challenge ?")) {
      return;
    }

    try {
      const updated = await approveChallenge(id);
      setChallenges(challenges.map((c) => (c.id === id ? updated : c)));
      setStats(stats ? { ...stats, pending: stats.pending - 1, approved: stats.approved + 1 } : null);
      setSuccessMessage("Challenge approuvé avec succès");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Erreur lors de l'approbation");
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectReason.trim()) {
      setError("Veuillez indiquer une raison pour le refus");
      return;
    }

    try {
      const updated = await rejectChallenge(id, rejectReason);
      setChallenges(challenges.map((c) => (c.id === id ? updated : c)));
      setStats(stats ? { ...stats, pending: stats.pending - 1, rejected: stats.rejected + 1 } : null);
      setRejectingId(null);
      setRejectReason("");
      setSuccessMessage("Challenge refusé");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Erreur lors du refus");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce challenge ?")) {
      return;
    }

    try {
      await deleteChallenge(id);
      const deleted = challenges.find((c) => c.id === id);
      setChallenges(challenges.filter((c) => c.id !== id));
      if (stats && deleted) {
        setStats({
          ...stats,
          total: stats.total - 1,
          [deleted.status]: stats[deleted.status as keyof ChallengeStats] - 1,
        });
      }
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

  return (
    <div style={{ backgroundColor: "#ebf2fa", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{ backgroundColor: "#1c2942", minHeight: "150px" }}
        className="flex items-center"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
          <Link
            to="/dashboard/admin"
            className="inline-flex items-center gap-2 text-sm mb-3 transition-colors hover:opacity-80"
            style={{ color: "rgba(235, 242, 250, 0.7)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au dashboard
          </Link>

          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#dbbacf" }}
            >
              <Trophy className="w-6 h-6 text-[#28303a]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Gestion des Challenges</h1>
              <p className="text-sm" style={{ color: "rgba(235, 242, 250, 0.7)" }}>
                Validez ou refusez les challenges proposés par les intervenants
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-2xl font-bold text-[#1c2942]">{stats.total}</p>
              <p className="text-sm text-[#1c2942]/60">Total</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-amber-400">
              <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
              <p className="text-sm text-[#1c2942]/60">En attente</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-emerald-400">
              <p className="text-2xl font-bold text-emerald-600">{stats.approved}</p>
              <p className="text-sm text-[#1c2942]/60">Approuvés</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-400">
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              <p className="text-sm text-[#1c2942]/60">Refusés</p>
            </div>
          </div>
        )}

        {/* Filtres */}
        <div className="bg-white rounded-xl p-4 mb-6 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#6d74b5]" />
            <span className="text-sm font-medium text-[#1c2942]">Filtres :</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-[#ebf2fa] rounded-lg text-sm focus:ring-2 focus:ring-[#6d74b5]"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="approved">Approuvés</option>
            <option value="rejected">Refusés</option>
          </select>
          <select
            value={thematiqueFilter}
            onChange={(e) => setThematiqueFilter(e.target.value)}
            className="px-3 py-2 border border-[#ebf2fa] rounded-lg text-sm focus:ring-2 focus:ring-[#6d74b5]"
          >
            <option value="">Toutes les thématiques</option>
            {THEMATIQUES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
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
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
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
              Aucun challenge trouvé
            </h3>
            <p className="text-[#1c2942]/60">
              {statusFilter || thematiqueFilter
                ? "Aucun challenge ne correspond aux filtres sélectionnés."
                : "Aucun challenge n'a encore été soumis."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm"
              >
                {/* Header de la carte */}
                <div
                  className="p-6 cursor-pointer hover:bg-[#ebf2fa]/30 transition-colors"
                  onClick={() =>
                    setExpandedId(expandedId === challenge.id ? null : challenge.id)
                  }
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-[#1c2942]">{challenge.title}</h3>
                        {getStatusBadge(challenge.status)}
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-[#1c2942]/60">
                        <span className="px-2 py-0.5 bg-[#ebf2fa] text-[#6d74b5] rounded-full text-xs font-medium">
                          {challenge.thematique}
                        </span>
                        {challenge.intervenant && (
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {challenge.intervenant.firstName} {challenge.intervenant.lastName}
                          </span>
                        )}
                        {challenge.duration && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {challenge.duration}
                          </span>
                        )}
                        {challenge.targetAudience && (
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {challenge.targetAudience}
                          </span>
                        )}
                      </div>
                    </div>

                    {expandedId === challenge.id ? (
                      <ChevronUp className="w-5 h-5 text-[#1c2942]/40" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#1c2942]/40" />
                    )}
                  </div>
                </div>

                {/* Contenu étendu */}
                {expandedId === challenge.id && (
                  <div className="px-6 pb-6 border-t border-[#ebf2fa]">
                    <div className="pt-4 space-y-4">
                      {/* Description */}
                      <div>
                        <h4 className="text-sm font-semibold text-[#1c2942] mb-2">
                          Description
                        </h4>
                        <p className="text-sm text-[#1c2942]/70 whitespace-pre-wrap">
                          {challenge.description}
                        </p>
                      </div>

                      {/* Objectifs */}
                      {challenge.objectives && challenge.objectives.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-[#1c2942] mb-2">
                            Objectifs
                          </h4>
                          <ul className="list-disc list-inside text-sm text-[#1c2942]/70 space-y-1">
                            {challenge.objectives.map((obj, i) => (
                              <li key={i}>{obj}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Livrables */}
                      {challenge.deliverables && challenge.deliverables.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-[#1c2942] mb-2">
                            Livrables
                          </h4>
                          <ul className="list-disc list-inside text-sm text-[#1c2942]/70 space-y-1">
                            {challenge.deliverables.map((del, i) => (
                              <li key={i}>{del}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Raison du refus si rejeté */}
                      {challenge.status === "rejected" && challenge.rejectionReason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-xs font-medium text-red-700 mb-1">
                            Raison du refus :
                          </p>
                          <p className="text-sm text-red-600">{challenge.rejectionReason}</p>
                        </div>
                      )}

                      {/* Formulaire de refus */}
                      {rejectingId === challenge.id && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <label className="block text-sm font-medium text-red-700 mb-2">
                            Raison du refus *
                          </label>
                          <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            rows={3}
                            placeholder="Expliquez pourquoi ce challenge est refusé..."
                            className="w-full px-3 py-2 border border-red-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 resize-none"
                          />
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              onClick={() => handleReject(challenge.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Confirmer le refus
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setRejectingId(null);
                                setRejectReason("");
                              }}
                            >
                              Annuler
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-[#ebf2fa]">
                        {challenge.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(challenge.id)}
                              className="bg-emerald-600 hover:bg-emerald-700"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approuver
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setRejectingId(challenge.id);
                                setRejectReason("");
                              }}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4" />
                              Refuser
                            </Button>
                          </>
                        )}
                        {challenge.status === "approved" && (
                          <Link to={`/tous-les-challenges/${challenge.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                              Voir la page publique
                            </Button>
                          </Link>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(challenge.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
