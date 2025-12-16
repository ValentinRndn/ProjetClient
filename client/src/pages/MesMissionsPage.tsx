import { useEffect, useState } from "react";
import {
  getMyEcoleMissions,
  getAllMissions,
  type Mission,
  type MissionStatus,
  deleteMission,
  updateMissionStatus,
  getMissionCandidatures,
  acceptCandidature,
  rejectCandidature,
  type Candidature
} from "@/services/missions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Search, Briefcase, Plus, Trash2, CheckCircle, Filter, User, Calendar, RotateCcw, Target, Clock, Users, X, MapPin, Award, Check, XCircle } from "lucide-react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export default function MesMissionsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ACTIVE" | "COMPLETED" | "all">("all");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // État pour les candidatures
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [loadingCandidatures, setLoadingCandidatures] = useState(false);
  const [showCandidaturesModal, setShowCandidaturesModal] = useState(false);

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    if (user) {
      fetchMissions();
    }
  }, [user, isAdmin]);

  const fetchMissions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = isAdmin
        ? await getAllMissions({ take: 100 })
        : await getMyEcoleMissions();

      setMissions(response.items || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des missions";
      setError(errorMessage);
      console.error("Error fetching missions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (missionId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette mission ?")) return;

    try {
      await deleteMission(missionId);
      setMissions(missions.filter(m => m.id !== missionId));
      setSuccessMessage("Mission supprimée avec succès");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Erreur lors de la suppression de la mission");
    }
  };

  const handleStatusChange = async (missionId: string, newStatus: MissionStatus) => {
    try {
      await updateMissionStatus(missionId, newStatus);
      setMissions(missions.map(m =>
        m.id === missionId ? { ...m, status: newStatus } : m
      ));
      setSuccessMessage(`Statut mis à jour: ${newStatus}`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Erreur lors de la mise à jour du statut");
    }
  };

  // Fonctions pour gérer les candidatures
  const handleViewCandidatures = async (mission: Mission) => {
    setSelectedMission(mission);
    setLoadingCandidatures(true);
    setShowCandidaturesModal(true);
    try {
      const data = await getMissionCandidatures(mission.id);
      setCandidatures(data);
    } catch (err) {
      setError("Erreur lors du chargement des candidatures");
    } finally {
      setLoadingCandidatures(false);
    }
  };

  const handleAcceptCandidature = async (candidatureId: string) => {
    try {
      const updatedMission = await acceptCandidature(candidatureId);
      setMissions(missions.map(m =>
        m.id === updatedMission.id ? updatedMission : m
      ));
      setShowCandidaturesModal(false);
      setSelectedMission(null);
      setCandidatures([]);
      setSuccessMessage("Candidature acceptée ! L'intervenant a été assigné à la mission.");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Erreur lors de l'acceptation de la candidature");
    }
  };

  const handleRejectCandidature = async (candidatureId: string) => {
    try {
      await rejectCandidature(candidatureId);
      setCandidatures(candidatures.map(c =>
        c.id === candidatureId ? { ...c, status: "refusee" as const } : c
      ));
      setSuccessMessage("Candidature refusée");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Erreur lors du refus de la candidature");
    }
  };

  const closeCandidaturesModal = () => {
    setShowCandidaturesModal(false);
    setSelectedMission(null);
    setCandidatures([]);
  };

  const filteredMissions = missions.filter((mission) => {
    if (statusFilter !== "all" && mission.status !== statusFilter) return false;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        mission.title.toLowerCase().includes(query) ||
        mission.description?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const activeCount = missions.filter((m) => m.status === "ACTIVE").length;
  const completedCount = missions.filter((m) => m.status === "COMPLETED").length;
  const assignedCount = missions.filter((m) => m.intervenant).length;

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  };

  const pageTitle = isAdmin ? "Gestion des Missions" : "Mes Missions";
  const pageDescription = isAdmin
    ? "Gérez toutes les missions de la plateforme"
    : "Gérez vos missions et suivez les candidatures";

  return (
    <div style={{ backgroundColor: "#ebf2fa", minHeight: "100vh" }}>
      {/* Header compact */}
      <div style={{ backgroundColor: "#1c2942", minHeight: "150px" }} className="flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#6d74b5" }}
              >
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{pageTitle}</h1>
                <p className="text-sm" style={{ color: "rgba(235, 242, 250, 0.7)" }}>
                  {pageDescription}
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => navigate("/nouvelle-mission")}
              className="bg-[#6d74b5] hover:bg-[#5a61a0]"
            >
              <Plus className="w-4 h-4" />
              Nouvelle mission
            </Button>
          </div>

          {/* Stats inline */}
          <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t border-white/20">
            {[
              { icon: <Target className="w-4 h-4" />, value: activeCount, label: "Actives" },
              { icon: <CheckCircle className="w-4 h-4" />, value: completedCount, label: "Terminées" },
              { icon: <User className="w-4 h-4" />, value: assignedCount, label: "Assignées" },
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span style={{ color: "rgba(235, 242, 250, 0.7)" }}>{stat.icon}</span>
                <span className="font-bold text-white">{stat.value}</span>
                <span className="text-sm" style={{ color: "rgba(235, 242, 250, 0.7)" }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Alerts */}
        {error && (
          <div className="mb-6">
            <Alert type="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </div>
        )}

        {successMessage && (
          <div className="mb-6">
            <Alert type="success" onClose={() => setSuccessMessage(null)}>
              {successMessage}
            </Alert>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-[#1c2942]/10 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#1c2942]/40 w-5 h-5" />
              <Input
                type="text"
                placeholder="Rechercher par titre, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-xl border-[#1c2942]/10 focus:border-[#6d74b5] focus:ring-[#6d74b5]/20"
              />
            </div>
            <div className="flex gap-2 md:col-span-3">
              <Button
                variant={statusFilter === "all" ? "primary" : "outline"}
                onClick={() => setStatusFilter("all")}
                className={`flex-1 h-12 rounded-xl ${statusFilter === "all" ? "bg-[#6d74b5] hover:bg-[#5a61a0]" : ""}`}
              >
                <Filter className="w-4 h-4" />
                Toutes
              </Button>
              <Button
                variant={statusFilter === "ACTIVE" ? "primary" : "outline"}
                onClick={() => setStatusFilter("ACTIVE")}
                className={`flex-1 h-12 rounded-xl ${statusFilter === "ACTIVE" ? "bg-[#6d74b5] hover:bg-[#5a61a0]" : ""}`}
              >
                <Target className="w-4 h-4" />
                Actives
              </Button>
              <Button
                variant={statusFilter === "COMPLETED" ? "primary" : "outline"}
                onClick={() => setStatusFilter("COMPLETED")}
                className={`flex-1 h-12 rounded-xl ${statusFilter === "COMPLETED" ? "bg-[#6d74b5] hover:bg-[#5a61a0]" : ""}`}
              >
                <CheckCircle className="w-4 h-4" />
                Terminées
              </Button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-[#1c2942]/60 font-medium">
            {filteredMissions.length} mission{filteredMissions.length > 1 ? "s" : ""} trouvée{filteredMissions.length > 1 ? "s" : ""}
          </span>
        </div>

        {/* Mission Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#1c2942]/10 p-6 animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="h-6 bg-[#ebf2fa] rounded w-3/4 mb-3"></div>
                    <div className="h-5 bg-[#ebf2fa] rounded-full w-20"></div>
                  </div>
                  <div className="h-8 w-8 bg-[#ebf2fa] rounded-lg"></div>
                </div>
                <div className="h-16 bg-[#ebf2fa] rounded mb-4"></div>
                <div className="h-10 bg-[#ebf2fa] rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : filteredMissions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#1c2942]/10 p-16 text-center">
            <div className="w-20 h-20 bg-[#ebf2fa] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-[#6d74b5]" />
            </div>
            <h3 className="text-2xl font-bold text-[#1c2942] mb-3">
              {missions.length === 0 ? "Aucune mission créée" : "Aucune mission trouvée"}
            </h3>
            <p className="text-[#1c2942]/60 max-w-md mx-auto mb-8">
              {missions.length === 0
                ? "Commencez par créer votre première mission pour trouver des intervenants qualifiés"
                : "Essayez de modifier vos critères de recherche"}
            </p>
            {missions.length === 0 && (
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/nouvelle-mission")}
                className="px-8 bg-[#6d74b5] hover:bg-[#5a61a0]"
              >
                <Plus className="w-5 h-5" />
                Créer ma première mission
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMissions.map((mission) => (
              <div
                key={mission.id}
                className="bg-white rounded-2xl border border-[#1c2942]/10 p-6 hover:shadow-lg hover:border-[#6d74b5]/30 transition-all duration-300"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        mission.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-[#ebf2fa] text-[#6d74b5]"
                      }`}>
                        {mission.status === "ACTIVE" ? (
                          <><Target className="w-3 h-3" /> Active</>
                        ) : (
                          <><CheckCircle className="w-3 h-3" /> Terminée</>
                        )}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-[#1c2942] line-clamp-2">
                      {mission.title}
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(mission.id)}
                    className="text-[#1c2942]/40 hover:text-red-600 hover:bg-red-50 rounded-lg p-2 h-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Description */}
                {mission.description && (
                  <p className="text-[#1c2942]/60 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {mission.description}
                  </p>
                )}

                {/* Dates */}
                {(mission.startDate || mission.endDate) && (
                  <div className="flex items-center gap-1.5 text-xs text-[#1c2942]/50 mb-4">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {formatDate(mission.startDate)}
                      {mission.endDate && ` → ${formatDate(mission.endDate)}`}
                    </span>
                  </div>
                )}

                {/* Intervenant badge */}
                {mission.intervenant && (
                  <div className="flex items-center gap-2 bg-[#ebf2fa] rounded-xl p-3 mb-4">
                    <div className="w-8 h-8 bg-[#6d74b5]/20 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-[#6d74b5]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#6d74b5] font-medium">Intervenant assigné</p>
                      <p className="text-sm text-[#1c2942] truncate">{mission.intervenant.user?.email}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 border-t border-[#1c2942]/10 space-y-2">
                  {/* Bouton voir candidatures - uniquement si pas d'intervenant assigné et mission active */}
                  {mission.status === "ACTIVE" && !mission.intervenant && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleViewCandidatures(mission)}
                      className="w-full rounded-xl bg-[#6d74b5] hover:bg-[#5a61a0]"
                    >
                      <Users className="w-4 h-4" />
                      Voir les candidatures
                    </Button>
                  )}
                  {mission.status === "ACTIVE" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(mission.id, "COMPLETED")}
                      className="w-full rounded-xl"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Marquer comme terminée
                    </Button>
                  )}
                  {mission.status === "COMPLETED" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(mission.id, "ACTIVE")}
                      className="w-full rounded-xl"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Réactiver la mission
                    </Button>
                  )}
                </div>

                {/* Created date */}
                <div className="flex items-center gap-1.5 text-xs text-[#1c2942]/40 mt-3">
                  <Clock className="w-3 h-3" />
                  <span>Créée le {formatDate(mission.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal des candidatures */}
      {showCandidaturesModal && selectedMission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header du modal */}
            <div className="p-6 border-b border-[#1c2942]/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#1c2942]">Candidatures</h2>
                  <p className="text-sm text-[#1c2942]/60 mt-1">{selectedMission.title}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeCandidaturesModal}
                  className="text-[#1c2942]/40 hover:text-[#1c2942] p-2 h-auto"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Contenu du modal */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingCandidatures ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-[#ebf2fa] rounded-xl p-4 animate-pulse">
                      <div className="h-5 bg-[#1c2942]/10 rounded w-1/3 mb-2"></div>
                      <div className="h-4 bg-[#1c2942]/10 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : candidatures.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-[#ebf2fa] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-[#6d74b5]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1c2942] mb-2">Aucune candidature</h3>
                  <p className="text-[#1c2942]/60">Aucun intervenant n'a encore postulé à cette mission.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {candidatures.map((candidature) => (
                    <div
                      key={candidature.id}
                      className={`bg-[#ebf2fa] rounded-xl p-4 border-2 ${
                        candidature.status === "en_attente"
                          ? "border-transparent"
                          : candidature.status === "acceptee"
                          ? "border-emerald-300 bg-emerald-50"
                          : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          {/* Info intervenant */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-[#6d74b5]/20 rounded-lg flex items-center justify-center">
                              <User className="w-5 h-5 text-[#6d74b5]" />
                            </div>
                            <div>
                              <p className="font-semibold text-[#1c2942]">
                                {candidature.intervenant?.user?.prenom} {candidature.intervenant?.user?.nom}
                              </p>
                              <p className="text-sm text-[#1c2942]/60">{candidature.intervenant?.user?.email}</p>
                            </div>
                          </div>

                          {/* Spécialité */}
                          {candidature.intervenant?.specialite && (
                            <div className="flex items-center gap-2 text-sm text-[#1c2942]/70 mb-2">
                              <Award className="w-4 h-4" />
                              <span>{candidature.intervenant.specialite}</span>
                            </div>
                          )}

                          {/* Message de candidature */}
                          {candidature.message && (
                            <div className="bg-white rounded-lg p-3 mt-3">
                              <p className="text-sm text-[#1c2942]/70 italic">"{candidature.message}"</p>
                            </div>
                          )}

                          {/* Tarif proposé */}
                          {candidature.tarifPropose && (
                            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#6d74b5]/10 text-[#6d74b5] rounded-lg text-sm font-medium">
                              Tarif proposé: {(candidature.tarifPropose / 100).toFixed(2)} €
                            </div>
                          )}

                          {/* Date de candidature */}
                          <div className="flex items-center gap-1.5 text-xs text-[#1c2942]/40 mt-3">
                            <Clock className="w-3 h-3" />
                            <span>Postulé le {new Date(candidature.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                          {candidature.status === "en_attente" && (
                            <>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleAcceptCandidature(candidature.id)}
                                className="bg-emerald-500 hover:bg-emerald-600 rounded-lg"
                              >
                                <Check className="w-4 h-4" />
                                Accepter
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRejectCandidature(candidature.id)}
                                className="text-red-600 border-red-200 hover:bg-red-50 rounded-lg"
                              >
                                <XCircle className="w-4 h-4" />
                                Refuser
                              </Button>
                            </>
                          )}
                          {candidature.status === "acceptee" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium">
                              <Check className="w-4 h-4" />
                              Acceptée
                            </span>
                          )}
                          {candidature.status === "refusee" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
                              <XCircle className="w-4 h-4" />
                              Refusée
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer du modal */}
            <div className="p-4 border-t border-[#1c2942]/10 bg-[#ebf2fa]/50">
              <Button
                variant="outline"
                onClick={closeCandidaturesModal}
                className="w-full rounded-xl"
              >
                Fermer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
