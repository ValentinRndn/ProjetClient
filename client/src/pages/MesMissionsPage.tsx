import { useEffect, useState } from "react";
import { getMyEcoleMissions, type Mission, type MissionStatus, deleteMission, updateMissionStatus } from "@/services/missions";
import { PageContainer } from "@/components/ui/PageContainer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Search, Briefcase, Plus, Trash2, CheckCircle, Filter, User, Calendar, RotateCcw, Sparkles, Target, Clock } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";

export default function MesMissionsPage() {
  const navigate = useNavigate();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ACTIVE" | "COMPLETED" | "all">("all");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getMyEcoleMissions();
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

  // Filtrer les missions
  const filteredMissions = missions.filter((mission) => {
    // Filtre par statut
    if (statusFilter !== "all" && mission.status !== statusFilter) return false;

    // Filtre par recherche
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-mesh overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        <PageContainer maxWidth="7xl" className="relative z-10 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="text-white">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-4">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span className="text-sm font-medium">Gestion des missions</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                  Mes{" "}
                  <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                    Missions
                  </span>
                </h1>

                <p className="text-lg text-indigo-100/80 max-w-xl">
                  Gérez vos missions, suivez les candidatures et trouvez les meilleurs intervenants pour votre établissement.
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate("/nouvelle-mission")}
                  className="bg-white text-indigo-900 hover:bg-indigo-50 shadow-xl shadow-indigo-900/20 px-6 py-3 h-auto"
                >
                  <Plus className="w-5 h-5" />
                  Nouvelle mission
                </Button>
              </motion.div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mt-10">
              {[
                { icon: <Target className="w-5 h-5" />, value: activeCount, label: "Actives" },
                { icon: <CheckCircle className="w-5 h-5" />, value: completedCount, label: "Terminées" },
                { icon: <User className="w-5 h-5" />, value: assignedCount, label: "Assignées" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + idx * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 min-w-[120px]"
                >
                  <div className="flex items-center gap-2 text-amber-300 mb-1">
                    {stat.icon}
                    <span className="text-2xl font-bold">{stat.value}</span>
                  </div>
                  <span className="text-sm text-indigo-100/70">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </PageContainer>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent" />
      </div>

      <PageContainer maxWidth="7xl" className="py-8 -mt-8 relative z-20">
        {/* Alerts */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert type="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </motion.div>
        )}

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert type="success" onClose={() => setSuccessMessage(null)}>
              {successMessage}
            </Alert>
          </motion.div>
        )}

        {/* Filters Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Rechercher par titre, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
              />
            </div>
            <div className="flex gap-2 md:col-span-3">
              <Button
                variant={statusFilter === "all" ? "primary" : "secondary"}
                onClick={() => setStatusFilter("all")}
                className="flex-1 h-12 rounded-xl"
              >
                <Filter className="w-4 h-4" />
                Toutes
              </Button>
              <Button
                variant={statusFilter === "ACTIVE" ? "primary" : "secondary"}
                onClick={() => setStatusFilter("ACTIVE")}
                className="flex-1 h-12 rounded-xl"
              >
                <Sparkles className="w-4 h-4" />
                Actives
              </Button>
              <Button
                variant={statusFilter === "COMPLETED" ? "primary" : "secondary"}
                onClick={() => setStatusFilter("COMPLETED")}
                className="flex-1 h-12 rounded-xl"
              >
                <CheckCircle className="w-4 h-4" />
                Terminées
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-gray-600 font-medium">
            {filteredMissions.length} mission{filteredMissions.length > 1 ? "s" : ""} trouvée{filteredMissions.length > 1 ? "s" : ""}
          </span>
        </div>

        {/* Mission Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-5 bg-gray-200 rounded-full w-20"></div>
                  </div>
                  <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="h-16 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : filteredMissions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-gray-100 p-16 text-center"
          >
            <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {missions.length === 0 ? "Aucune mission créée" : "Aucune mission trouvée"}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              {missions.length === 0
                ? "Commencez par créer votre première mission pour trouver des intervenants qualifiés"
                : "Essayez de modifier vos critères de recherche"}
            </p>
            {missions.length === 0 && (
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/nouvelle-mission")}
                className="px-8"
              >
                <Plus className="w-5 h-5" />
                Créer ma première mission
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredMissions.map((mission, index) => (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-100 transition-all duration-300"
              >
                {/* Decorative gradient on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-50/0 to-purple-50/0 group-hover:from-indigo-50/50 group-hover:to-purple-50/30 transition-all duration-300 pointer-events-none" />

                <div className="relative">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          mission.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                            : "bg-blue-100 text-blue-700 border-blue-200"
                        }`}>
                          {mission.status === "ACTIVE" ? (
                            <><Sparkles className="w-3 h-3" /> Active</>
                          ) : (
                            <><CheckCircle className="w-3 h-3" /> Terminée</>
                          )}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-900 transition-colors line-clamp-2">
                        {mission.title}
                      </h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(mission.id)}
                      className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg p-2 h-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Description */}
                  {mission.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {mission.description}
                    </p>
                  )}

                  {/* Dates */}
                  {(mission.startDate || mission.endDate) && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {formatDate(mission.startDate)}
                        {mission.endDate && ` → ${formatDate(mission.endDate)}`}
                      </span>
                    </div>
                  )}

                  {/* Intervenant badge */}
                  {mission.intervenant && (
                    <div className="flex items-center gap-2 bg-indigo-50 rounded-xl p-3 mb-4">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-indigo-600 font-medium">Intervenant assigné</p>
                        <p className="text-sm text-indigo-900 truncate">{mission.intervenant.user?.email}</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-4 border-t border-gray-100">
                    {mission.status === "ACTIVE" && (
                      <Button
                        variant="secondary"
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
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-3">
                    <Clock className="w-3 h-3" />
                    <span>Créée le {formatDate(mission.createdAt)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </PageContainer>
    </div>
  );
}
