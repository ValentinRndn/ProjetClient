import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { getAdminStats, type AdminStats } from "@/services/admin";
import { Link } from "react-router";
import { Card } from "@/components/ui/Card";
import { PageContainer } from "@/components/ui/PageContainer";
import { Button } from "@/components/ui/Button";
import {
  Users,
  UserCheck,
  Building2,
  AlertCircle,
  TrendingUp,
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
      <PageContainer maxWidth="7xl" className="py-8">
        <div className="text-center py-12">
          <div className="text-gray-500">Vérification des permissions...</div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="7xl" className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard Administrateur
        </h1>
        <p className="text-gray-600">
          Vue d'ensemble de la plateforme Vizion Academy
        </p>
      </div>

      {error && (
        <div className="mb-6">
          <Alert type="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="text-gray-500">Chargement des statistiques...</div>
        </div>
      ) : stats ? (
        <>
          {/* Statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Total Utilisateurs
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalUsers || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Total Intervenants
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalIntervenants || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Écoles</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalEcoles || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">En attente</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {stats.pendingIntervenants || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Statistiques intervenants */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Intervenants Approuvés
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.approvedIntervenants || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.totalIntervenants
                      ? Math.round(
                          ((stats.approvedIntervenants || 0) /
                            stats.totalIntervenants) *
                            100
                        )
                      : 0}
                    % du total
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Intervenants Rejetés
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.rejectedIntervenants || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.totalIntervenants
                      ? Math.round(
                          ((stats.rejectedIntervenants || 0) /
                            stats.totalIntervenants) *
                            100
                        )
                      : 0}
                    % du total
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
            </Card>
          </div>

          {/* Actions rapides */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Actions rapides
            </h2>
            <div className="flex flex-wrap gap-4">
              <Link to="/dashboard/admin/intervenants">
                <Button variant="primary">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Gérer les Intervenants
                </Button>
              </Link>
              <Link to="/dashboard/admin/users">
                <Button variant="primary">
                  <Users className="w-4 h-4 mr-2" />
                  Gérer les Utilisateurs
                </Button>
              </Link>
            </div>
          </Card>
        </>
      ) : null}
    </PageContainer>
  );
}
