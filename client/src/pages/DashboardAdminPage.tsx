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
  Receipt,
  Eye,
  Settings,
  Target,
} from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { useAuth } from "@/hooks/useAuth";

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

  if (!authLoading && user && user.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#ebf2fa] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#ebf2fa] border-t-[#1c2942] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#1c2942]/60">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ebf2fa]">
      <PageContainer maxWidth="7xl" className="py-8">
        {/* Header compact */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#1c2942] rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1c2942]">Dashboard Administrateur</h1>
              <p className="text-sm text-[#1c2942]/60">Vue d'ensemble de la plateforme</p>
            </div>
          </div>
        </div>
        {error && (
          <div className="mb-6">
            <Alert type="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#1c2942]/10 p-6 animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="h-4 bg-[#ebf2fa] rounded w-24 mb-3"></div>
                    <div className="h-8 bg-[#ebf2fa] rounded w-16"></div>
                  </div>
                  <div className="w-12 h-12 bg-[#ebf2fa] rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        ) : stats ? (
          <>
            {/* Statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                {
                  label: "Total Utilisateurs",
                  value: stats.totalUsers || 0,
                  icon: <Users className="w-6 h-6" />,
                  bgColor: "bg-[#ebf2fa]",
                  textColor: "text-[#1c2942]",
                  iconColor: "text-[#6d74b5]",
                },
                {
                  label: "Total Intervenants",
                  value: stats.totalIntervenants || 0,
                  icon: <UserCheck className="w-6 h-6" />,
                  bgColor: "bg-[#ebf2fa]",
                  textColor: "text-[#1c2942]",
                  iconColor: "text-[#6d74b5]",
                },
                {
                  label: "Total Écoles",
                  value: stats.totalEcoles || 0,
                  icon: <Building2 className="w-6 h-6" />,
                  bgColor: "bg-emerald-100",
                  textColor: "text-emerald-600",
                  iconColor: "text-emerald-600",
                },
                {
                  label: "En attente",
                  value: stats.pendingIntervenants || 0,
                  icon: <AlertCircle className="w-6 h-6" />,
                  bgColor: "bg-amber-100",
                  textColor: "text-amber-600",
                  iconColor: "text-amber-600",
                  highlight: (stats.pendingIntervenants || 0) > 0,
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className={`group relative bg-white rounded-2xl border p-6 hover:shadow-xl transition-all duration-300 ${
                    stat.highlight ? "border-amber-200 bg-amber-50/50" : "border-[#1c2942]/10 hover:border-[#6d74b5]/30"
                  }`}
                >
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#1c2942]/60 font-medium mb-1">{stat.label}</p>
                      <p className={`text-3xl font-bold ${stat.textColor}`}>
                        {stat.value}
                      </p>
                    </div>
                    <div className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center ${stat.iconColor} group-hover:scale-110 transition-transform`}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Statistiques intervenants */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl border border-[#1c2942]/10 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-[#1c2942]/60">Intervenants Approuvés</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {stats.approvedIntervenants || 0}
                    </p>
                  </div>
                </div>
                <div className="h-2 bg-[#ebf2fa] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.totalIntervenants ? ((stats.approvedIntervenants || 0) / stats.totalIntervenants) * 100 : 0}%`
                    }}
                  />
                </div>
                <p className="text-xs text-[#1c2942]/50 mt-2">
                  {stats.totalIntervenants
                    ? Math.round(((stats.approvedIntervenants || 0) / stats.totalIntervenants) * 100)
                    : 0}% du total
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-[#1c2942]/10 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-[#1c2942]/60">En attente de validation</p>
                    <p className="text-2xl font-bold text-amber-600">
                      {stats.pendingIntervenants || 0}
                    </p>
                  </div>
                </div>
                <div className="h-2 bg-[#ebf2fa] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.totalIntervenants ? ((stats.pendingIntervenants || 0) / stats.totalIntervenants) * 100 : 0}%`
                    }}
                  />
                </div>
                <p className="text-xs text-[#1c2942]/50 mt-2">
                  {stats.totalIntervenants
                    ? Math.round(((stats.pendingIntervenants || 0) / stats.totalIntervenants) * 100)
                    : 0}% du total
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-[#1c2942]/10 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-[#1c2942]/60">Intervenants Rejetés</p>
                    <p className="text-2xl font-bold text-red-600">
                      {stats.rejectedIntervenants || 0}
                    </p>
                  </div>
                </div>
                <div className="h-2 bg-[#ebf2fa] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.totalIntervenants ? ((stats.rejectedIntervenants || 0) / stats.totalIntervenants) * 100 : 0}%`
                    }}
                  />
                </div>
                <p className="text-xs text-[#1c2942]/50 mt-2">
                  {stats.totalIntervenants
                    ? Math.round(((stats.rejectedIntervenants || 0) / stats.totalIntervenants) * 100)
                    : 0}% du total
                </p>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-2xl border border-[#1c2942]/10 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#ebf2fa] rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#6d74b5]" />
                </div>
                <h2 className="text-xl font-bold text-[#1c2942]">Actions rapides</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link to="/dashboard/admin/intervenants" className="group">
                  <div className="flex items-center justify-between p-4 bg-[#ebf2fa] hover:bg-[#ebf2fa]/70 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#1c2942] rounded-lg flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1c2942]">Gérer les Intervenants</p>
                        <p className="text-sm text-[#1c2942]/60">Valider les demandes</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#6d74b5] group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                <Link to="/dashboard/admin/users" className="group">
                  <div className="flex items-center justify-between p-4 bg-[#ebf2fa] hover:bg-[#ebf2fa]/70 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#6d74b5] rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1c2942]">Gérer les Utilisateurs</p>
                        <p className="text-sm text-[#1c2942]/60">Tous les comptes</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#6d74b5] group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                <Link to="/missions" className="group">
                  <div className="flex items-center justify-between p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1c2942]">Voir les Missions</p>
                        <p className="text-sm text-[#1c2942]/60">Toutes les missions</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                <Link to="/dashboard/admin/factures" className="group">
                  <div className="flex items-center justify-between p-4 bg-[#ebf2fa] hover:bg-[#ebf2fa]/70 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#6d74b5] rounded-lg flex items-center justify-center">
                        <Receipt className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1c2942]">Facturation</p>
                        <p className="text-sm text-[#1c2942]/60">Gérer les factures</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#6d74b5] group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                <Link to="/intervenants" className="group">
                  <div className="flex items-center justify-between p-4 bg-[#ebf2fa] hover:bg-[#ebf2fa]/70 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#1c2942] rounded-lg flex items-center justify-center">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1c2942]">Annuaire public</p>
                        <p className="text-sm text-[#1c2942]/60">Voir comme visiteur</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#6d74b5] group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </div>
            </div>

            {/* Menu Administration */}
            <div className="mt-8 bg-white rounded-2xl border border-[#1c2942]/10 overflow-hidden">
              <div className="bg-[#1c2942] text-white p-4">
                <h2 className="font-bold flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Menu Administration
                </h2>
              </div>

              <div className="divide-y divide-[#1c2942]/10">
                {[
                  { label: "Tableau de bord", to: "/dashboard/admin", icon: <BarChart3 className="w-4 h-4" />, active: true },
                  { label: "Utilisateurs", to: "/dashboard/admin/users", icon: <Users className="w-4 h-4" />, desc: "Gérer tous les comptes" },
                  { label: "Intervenants", to: "/dashboard/admin/intervenants", icon: <UserCheck className="w-4 h-4" />, desc: "Valider les profils" },
                  { label: "Missions", to: "/gestion-missions", icon: <Target className="w-4 h-4" />, desc: "Gérer les missions" },
                  { label: "Factures", to: "/dashboard/admin/factures", icon: <Receipt className="w-4 h-4" />, desc: "Facturation" },
                  { label: "Statistiques", to: "/dashboard/admin", icon: <Activity className="w-4 h-4" />, desc: "Vue d'ensemble" },
                ].map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.to}
                    className={`flex items-center justify-between p-4 hover:bg-[#ebf2fa] transition-colors ${
                      item.active ? "bg-[#ebf2fa] border-l-4 border-[#6d74b5]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        item.active ? "bg-[#6d74b5] text-white" : "bg-[#ebf2fa] text-[#6d74b5]"
                      }`}>
                        {item.icon}
                      </div>
                      <div>
                        <span className={`font-medium ${item.active ? "text-[#6d74b5]" : "text-[#1c2942]"}`}>
                          {item.label}
                        </span>
                        {item.desc && (
                          <p className="text-xs text-[#1c2942]/50">{item.desc}</p>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#1c2942]/40" />
                  </Link>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </PageContainer>
    </div>
  );
}

