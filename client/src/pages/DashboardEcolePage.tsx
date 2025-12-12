import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { getMyEcoleMissions, type Mission } from "@/services/missions";
import { PageContainer } from "@/components/ui/PageContainer";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { MissionCard } from "@/components/features/MissionCard";
import {
  Building2,
  Briefcase,
  Plus,
  Users,
  CheckCircle,
  Clock,
  FileText,
  Sparkles,
  ArrowRight,
  Target,
  History,
  Heart,
} from "lucide-react";
import { motion } from "motion/react";

export default function DashboardEcolePage() {
  const { user } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const stats = {
    total: missions.length,
    active: missions.filter((m) => m.status === "ACTIVE").length,
    completed: missions.filter((m) => m.status === "COMPLETED").length,
    draft: missions.filter((m) => m.status === "DRAFT").length,
    withIntervenant: missions.filter((m) => m.intervenant).length,
  };

  const ecoleName = user?.ecole?.name || "Mon École";

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

        <PageContainer maxWidth="7xl" className="relative z-10 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="text-white">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-4">
                  <Building2 className="w-4 h-4 text-amber-300" />
                  <span className="text-sm font-medium">Espace École</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                  Bienvenue,{" "}
                  <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                    {ecoleName}
                  </span>
                </h1>

                <p className="text-lg text-indigo-100/80 max-w-xl">
                  Gérez vos missions et trouvez les meilleurs intervenants pour vos étudiants.
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link to="/nouvelle-mission">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-white text-indigo-900 hover:bg-indigo-50 shadow-xl shadow-indigo-900/20 px-6 py-3 h-auto"
                  >
                    <Plus className="w-5 h-5" />
                    Nouvelle mission
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mt-10">
              {[
                { icon: <Briefcase className="w-5 h-5" />, value: stats.total, label: "Total" },
                { icon: <Target className="w-5 h-5" />, value: stats.active, label: "Actives" },
                { icon: <CheckCircle className="w-5 h-5" />, value: stats.completed, label: "Terminées" },
                { icon: <Users className="w-5 h-5" />, value: stats.withIntervenant, label: "Assignées" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + idx * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 min-w-[100px]"
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

        {/* Actions rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-xl p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Actions rapides</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Link to="/nouvelle-mission" className="group">
              <div className="flex items-center justify-between p-4 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Proposer une mission</p>
                    <p className="text-sm text-gray-500">Créer une nouvelle mission</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-indigo-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link to="/intervenants" className="group">
              <div className="flex items-center justify-between p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Trouver un intervenant</p>
                    <p className="text-sm text-gray-500">Parcourir les profils</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link to="/dashboard/ecole/favoris" className="group">
              <div className="flex items-center justify-between p-4 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-500 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Mes favoris</p>
                    <p className="text-sm text-gray-500">Intervenants favoris</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-rose-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link to="/missions" className="group">
              <div className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Voir les missions</p>
                    <p className="text-sm text-gray-500">Toutes les missions</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link to="/dashboard/ecole/historique" className="group">
              <div className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <History className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Historique</p>
                    <p className="text-sm text-gray-500">Mes collaborations</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Liste des missions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Mes missions récentes</h2>
            <Link to="/mes-missions">
              <Button variant="outline" size="sm" className="rounded-xl">
                Voir tout
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-16 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : missions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl border border-gray-100 p-16 text-center"
            >
              <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Aucune mission
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-8">
                Vous n'avez pas encore créé de mission. Commencez maintenant pour trouver les meilleurs intervenants !
              </p>
              <Link to="/nouvelle-mission">
                <Button variant="primary" size="lg" className="px-8">
                  <Plus className="w-5 h-5" />
                  Proposer une mission
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {missions.slice(0, 6).map((mission, index) => (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <MissionCard
                    mission={mission}
                    showApplyButton={false}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </PageContainer>
    </div>
  );
}
