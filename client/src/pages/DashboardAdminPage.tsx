import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { getAdminStats, type AdminStats } from "@/services/admin";
import { Link } from "react-router";
import { PageContainer } from "@/components/ui/PageContainer";
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
  Receipt,
  Eye,
  Target,
  Mail,
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
        <div className="bg-white rounded-2xl border border-[#1c2942]/10 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#1c2942] rounded-xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#1c2942]">Dashboard Administrateur</h1>
                <div className="flex items-center gap-2 text-sm text-[#1c2942]/60">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats inline */}
          {stats && (
            <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t border-[#1c2942]/10">
              {[
                { icon: <Users className="w-4 h-4" />, value: stats.totalUsers || 0, label: "Utilisateurs" },
                { icon: <UserCheck className="w-4 h-4" />, value: stats.totalIntervenants || 0, label: "Intervenants" },
                { icon: <Building2 className="w-4 h-4" />, value: stats.totalEcoles || 0, label: "Écoles" },
                { icon: <AlertCircle className="w-4 h-4" />, value: stats.pendingIntervenants || 0, label: "En attente", highlight: (stats.pendingIntervenants || 0) > 0 },
              ].map((stat, idx) => (
                <div key={idx} className={`flex items-center gap-2 ${stat.highlight ? "text-amber-600" : ""}`}>
                  <span className={stat.highlight ? "text-amber-500" : "text-[#6d74b5]"}>{stat.icon}</span>
                  <span className={`font-bold ${stat.highlight ? "text-amber-600" : "text-[#1c2942]"}`}>{stat.value}</span>
                  <span className={`text-sm ${stat.highlight ? "text-amber-500" : "text-[#1c2942]/60"}`}>{stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6">
            <Alert type="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-[#1c2942]/10 p-6 animate-pulse">
              <div className="h-6 bg-[#ebf2fa] rounded w-1/3 mb-6"></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-24 bg-[#ebf2fa] rounded"></div>
                <div className="h-24 bg-[#ebf2fa] rounded"></div>
                <div className="h-24 bg-[#ebf2fa] rounded"></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-[#1c2942]/10 p-6 animate-pulse">
              <div className="h-6 bg-[#ebf2fa] rounded w-1/2 mb-6"></div>
              <div className="space-y-3">
                <div className="h-16 bg-[#ebf2fa] rounded-xl"></div>
                <div className="h-16 bg-[#ebf2fa] rounded-xl"></div>
                <div className="h-16 bg-[#ebf2fa] rounded-xl"></div>
              </div>
            </div>
          </div>
        ) : stats ? (
          <>
            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Statistiques intervenants */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-[#1c2942]/10 shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#ebf2fa] rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-[#6d74b5]" />
                  </div>
                  <h2 className="text-xl font-bold text-[#1c2942]">Statut des intervenants</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Approuvés */}
                  <div className="bg-emerald-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-emerald-600">{stats.approvedIntervenants || 0}</p>
                        <p className="text-xs text-emerald-600/70">Approuvés</p>
                      </div>
                    </div>
                    <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{
                          width: `${stats.totalIntervenants ? ((stats.approvedIntervenants || 0) / stats.totalIntervenants) * 100 : 0}%`
                        }}
                      />
                    </div>
                    <p className="text-xs text-emerald-600/60 mt-2">
                      {stats.totalIntervenants ? Math.round(((stats.approvedIntervenants || 0) / stats.totalIntervenants) * 100) : 0}% du total
                    </p>
                  </div>

                  {/* En attente */}
                  <div className="bg-amber-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-amber-600">{stats.pendingIntervenants || 0}</p>
                        <p className="text-xs text-amber-600/70">En attente</p>
                      </div>
                    </div>
                    <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{
                          width: `${stats.totalIntervenants ? ((stats.pendingIntervenants || 0) / stats.totalIntervenants) * 100 : 0}%`
                        }}
                      />
                    </div>
                    <p className="text-xs text-amber-600/60 mt-2">
                      {stats.totalIntervenants ? Math.round(((stats.pendingIntervenants || 0) / stats.totalIntervenants) * 100) : 0}% du total
                    </p>
                  </div>

                  {/* Rejetés */}
                  <div className="bg-red-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-red-600">{stats.rejectedIntervenants || 0}</p>
                        <p className="text-xs text-red-600/70">Rejetés</p>
                      </div>
                    </div>
                    <div className="h-2 bg-red-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{
                          width: `${stats.totalIntervenants ? ((stats.rejectedIntervenants || 0) / stats.totalIntervenants) * 100 : 0}%`
                        }}
                      />
                    </div>
                    <p className="text-xs text-red-600/60 mt-2">
                      {stats.totalIntervenants ? Math.round(((stats.rejectedIntervenants || 0) / stats.totalIntervenants) * 100) : 0}% du total
                    </p>
                  </div>
                </div>

                {/* Alerte si intervenants en attente */}
                {(stats.pendingIntervenants || 0) > 0 && (
                  <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                      <div className="flex-1">
                        <p className="font-medium text-amber-800">
                          {stats.pendingIntervenants} intervenant{(stats.pendingIntervenants || 0) > 1 ? "s" : ""} en attente de validation
                        </p>
                        <p className="text-sm text-amber-600">Cliquez sur "Gérer les intervenants" pour les valider</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions rapides */}
              <div className="bg-white rounded-2xl border border-[#1c2942]/10 shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#ebf2fa] rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[#6d74b5]" />
                  </div>
                  <h2 className="text-xl font-bold text-[#1c2942]">Actions rapides</h2>
                </div>

                <div className="space-y-3">
                  <Link to="/dashboard/admin/intervenants" className="block group">
                    <div className="flex items-center justify-between p-4 bg-[#ebf2fa] hover:bg-[#ebf2fa]/70 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#1c2942] rounded-lg flex items-center justify-center">
                          <UserCheck className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-[#1c2942]">Gérer les intervenants</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#6d74b5] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>

                  <Link to="/dashboard/admin/users" className="block group">
                    <div className="flex items-center justify-between p-4 bg-[#ebf2fa] hover:bg-[#ebf2fa]/70 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#6d74b5] rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-[#1c2942]">Gérer les utilisateurs</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#6d74b5] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>

                  <Link to="/gestion-missions" className="block group">
                    <div className="flex items-center justify-between p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                          <Target className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-[#1c2942]">Gérer les missions</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>

                  <Link to="/dashboard/admin/factures" className="block group">
                    <div className="flex items-center justify-between p-4 bg-[#ebf2fa] hover:bg-[#ebf2fa]/70 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#6d74b5] rounded-lg flex items-center justify-center">
                          <Receipt className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-[#1c2942]">Facturation</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#6d74b5] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>

                  <Link to="/intervenants" className="block group">
                    <div className="flex items-center justify-between p-4 bg-[#ebf2fa] hover:bg-[#ebf2fa]/70 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#1c2942] rounded-lg flex items-center justify-center">
                          <Eye className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-[#1c2942]">Annuaire public</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#6d74b5] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </PageContainer>
    </div>
  );
}
