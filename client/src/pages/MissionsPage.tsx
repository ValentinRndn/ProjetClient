import { useEffect, useState } from "react";
import { getAllMissions, applyToMission, type Mission, type MissionStatus } from "@/services/missions";
import { MissionCard } from "@/components/features/MissionCard";
import { PageContainer } from "@/components/ui/PageContainer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Search, Briefcase, Filter, Sparkles, Target, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import { motion } from "motion/react";

export default function MissionsPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<MissionStatus | "all">("ACTIVE");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState<string | null>(null);

  useEffect(() => {
    fetchMissions();
  }, [statusFilter]);

  const fetchMissions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getAllMissions({
        status: statusFilter !== "all" ? statusFilter : undefined,
        take: 50,
      });
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

  const handleApply = async (missionId: string) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!confirm("Voulez-vous postuler à cette mission ?")) return;

    try {
      setIsApplying(missionId);
      setError(null);
      const updatedMission = await applyToMission(missionId);

      // Mettre à jour la mission dans la liste
      setMissions(missions.map(m =>
        m.id === missionId ? updatedMission : m
      ));

      setSuccessMessage("Candidature envoyée avec succès ! Vous êtes maintenant assigné à cette mission.");
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message: string }).message
        : "Erreur lors de la candidature";
      setError(errorMessage);
    } finally {
      setIsApplying(null);
    }
  };

  // Filtrer les missions selon la recherche
  const filteredMissions = missions.filter((mission) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      mission.title.toLowerCase().includes(query) ||
      mission.description?.toLowerCase().includes(query) ||
      mission.ecole?.name.toLowerCase().includes(query)
    );
  });

  const activeCount = missions.filter((m) => m.status === "ACTIVE").length;
  const completedCount = missions.filter((m) => m.status === "COMPLETED").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-mesh overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-3xl" />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        <PageContainer maxWidth="7xl" className="relative z-10 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-medium">Opportunités disponibles</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
              Mur des{" "}
              <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                Missions
              </span>
            </h1>

            <p className="text-xl text-indigo-100/80 max-w-2xl mx-auto mb-10">
              Découvrez les opportunités d'intervention dans les meilleures écoles
              et partagez votre expertise avec les étudiants de demain.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { icon: <Target className="w-5 h-5" />, value: activeCount, label: "Missions actives" },
                { icon: <TrendingUp className="w-5 h-5" />, value: completedCount, label: "Missions terminées" },
                { icon: <Briefcase className="w-5 h-5" />, value: missions.length, label: "Total missions" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + idx * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 min-w-[140px]"
                >
                  <div className="flex items-center justify-center gap-2 text-amber-300 mb-1">
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Rechercher par titre, description, école..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
              />
            </div>
            <div className="flex gap-2 md:col-span-2">
              <Button
                variant={statusFilter === "ACTIVE" ? "primary" : "secondary"}
                onClick={() => setStatusFilter("ACTIVE")}
                className="flex-1 h-12 rounded-xl"
              >
                <Filter className="w-4 h-4" />
                Actives
              </Button>
              <Button
                variant={statusFilter === "all" ? "primary" : "secondary"}
                onClick={() => setStatusFilter("all")}
                className="flex-1 h-12 rounded-xl"
              >
                Toutes
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
                <div className="flex gap-2 mb-4">
                  <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-16 bg-gray-200 rounded mb-4"></div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-9 bg-gray-200 rounded-lg w-24"></div>
                </div>
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
              Aucune mission trouvée
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchQuery
                ? "Essayez de modifier vos critères de recherche pour découvrir plus d'opportunités"
                : "Il n'y a pas de missions disponibles pour le moment. Revenez bientôt !"}
            </p>
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
              >
                <MissionCard
                  mission={mission}
                  onApply={handleApply}
                  showApplyButton={user?.role === "INTERVENANT"}
                  isApplying={isApplying === mission.id}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </PageContainer>
    </div>
  );
}
