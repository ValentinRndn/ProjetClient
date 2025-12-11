import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { getAdminStats, type AdminStats } from "@/services/admin";
import { Link } from "react-router";
import { PageContainer } from "@/components/ui/PageContainer";
import { Button } from "@/components/ui/Button";
import {
  Users,
  UserCheck,
  Building2,
  AlertCircle,
  TrendingUp,
  Shield,
  Sparkles,
  ArrowRight,
  Activity,
  BarChart3,
} from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "motion/react";

export default function DashboardAdminPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAdminStats();
      setStats(data);
    } catch (err: any) {
      const errorMessage =
        err?.message || "Erreur lors du chargement des statistiques";

      // Si erreur 403, rediriger vers le dashboard approprié
      if (err?.status === 403 || err?.status === 401) {
        setError("Vous n'avez pas les permissions nécessaires");
        return;
      }

      setError(errorMessage);
      console.error("Error fetching stats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Protection supplémentaire : rediriger si pas admin
  if (!authLoading && user && user.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  // Afficher un loader pendant la vérification d'authentification
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Vérification des permissions...</p>
        </motion.div>
      </div>
    );
  }

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
            className="text-white"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-4">
              <Shield className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-medium">Administration</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Dashboard{" "}
              <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                Administrateur
              </span>
            </h1>

            <p className="text-lg text-indigo-100/80 max-w-2xl">
              Vue d'ensemble de la plateforme Vizion Academy. Gérez les utilisateurs, les intervenants et les écoles.
            </p>
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

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        ) : stats ? (
          <>
            {/* Statistiques principales */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              {[
                {
                  label: "Total Utilisateurs",
                  value: stats.totalUsers || 0,
                  icon: <Users className="w-6 h-6" />,
                  color: "blue",
                  bgColor: "bg-blue-100",
                  textColor: "text-blue-600",
                },
                {
                  label: "Total Intervenants",
                  value: stats.totalIntervenants || 0,
                  icon: <UserCheck className="w-6 h-6" />,
                  color: "indigo",
                  bgColor: "bg-indigo-100",
                  textColor: "text-indigo-600",
                },
                {
                  label: "Total Écoles",
                  value: stats.totalEcoles || 0,
                  icon: <Building2 className="w-6 h-6" />,
                  color: "emerald",
                  bgColor: "bg-emerald-100",
                  textColor: "text-emerald-600",
                },
                {
                  label: "En attente",
                  value: stats.pendingIntervenants || 0,
                  icon: <AlertCircle className="w-6 h-6" />,
                  color: "amber",
                  bgColor: "bg-amber-100",
                  textColor: "text-amber-600",
                  highlight: (stats.pendingIntervenants || 0) > 0,
                },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className={`group relative bg-white rounded-2xl border p-6 hover:shadow-xl transition-all duration-300 ${
                    stat.highlight ? "border-amber-200 bg-amber-50/50" : "border-gray-100 hover:border-indigo-100"
                  }`}
                >
                  {/* Decorative gradient on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-50/0 to-purple-50/0 group-hover:from-indigo-50/50 group-hover:to-purple-50/30 transition-all duration-300 pointer-events-none" />

                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">{stat.label}</p>
                      <p className={`text-3xl font-bold ${stat.textColor}`}>
                        {stat.value}
                      </p>
                    </div>
                    <div className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center ${stat.textColor} group-hover:scale-110 transition-transform`}>
                      {stat.icon}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Statistiques intervenants */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Intervenants Approuvés</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {stats.approvedIntervenants || 0}
                    </p>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.totalIntervenants ? ((stats.approvedIntervenants || 0) / stats.totalIntervenants) * 100 : 0}%`
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {stats.totalIntervenants
                    ? Math.round(((stats.approvedIntervenants || 0) / stats.totalIntervenants) * 100)
                    : 0}% du total
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">En attente de validation</p>
                    <p className="text-2xl font-bold text-amber-600">
                      {stats.pendingIntervenants || 0}
                    </p>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.totalIntervenants ? ((stats.pendingIntervenants || 0) / stats.totalIntervenants) * 100 : 0}%`
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {stats.totalIntervenants
                    ? Math.round(((stats.pendingIntervenants || 0) / stats.totalIntervenants) * 100)
                    : 0}% du total
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Intervenants Rejetés</p>
                    <p className="text-2xl font-bold text-red-600">
                      {stats.rejectedIntervenants || 0}
                    </p>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.totalIntervenants ? ((stats.rejectedIntervenants || 0) / stats.totalIntervenants) * 100 : 0}%`
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {stats.totalIntervenants
                    ? Math.round(((stats.rejectedIntervenants || 0) / stats.totalIntervenants) * 100)
                    : 0}% du total
                </p>
              </div>
            </motion.div>

            {/* Actions rapides */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl border border-gray-100 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Actions rapides</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link to="/dashboard/admin/intervenants" className="group">
                  <div className="flex items-center justify-between p-4 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Gérer les Intervenants</p>
                        <p className="text-sm text-gray-500">Valider les demandes</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-indigo-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                <Link to="/dashboard/admin/users" className="group">
                  <div className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Gérer les Utilisateurs</p>
                        <p className="text-sm text-gray-500">Tous les comptes</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                <Link to="/missions" className="group">
                  <div className="flex items-center justify-between p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Voir les Missions</p>
                        <p className="text-sm text-gray-500">Toutes les missions</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </div>
            </motion.div>
          </>
        ) : null}
      </PageContainer>
    </div>
  );
}
