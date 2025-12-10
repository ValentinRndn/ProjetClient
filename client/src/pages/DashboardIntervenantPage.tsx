import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getIntervenantById } from "@/services/intervenants";
import { Card } from "@/components/ui/Card";
import { PageContainer } from "@/components/ui/PageContainer";
import { Button } from "@/components/ui/Button";
import {
  User,
  Mail,
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { Link } from "react-router";

export default function DashboardIntervenantPage() {
  const { user } = useAuth();
  const [intervenant, setIntervenant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIntervenant();
  }, [user]);

  const fetchIntervenant = async () => {
    if (!user?.intervenant?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await getIntervenantById(user.intervenant.id);
      setIntervenant(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors du chargement";
      setError(errorMessage);
      console.error("Error fetching intervenant:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4" />
            Approuvé
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-4 h-4" />
            En attente de validation
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <XCircle className="w-4 h-4" />
            Rejeté
          </span>
        );
      default:
        return null;
    }
  };

  const fullName = intervenant
    ? [intervenant.firstName, intervenant.lastName].filter(Boolean).join(" ") ||
      user?.name ||
      user?.email?.split("@")[0] ||
      "Intervenant"
    : user?.email?.split("@")[0] || "Intervenant";

  return (
    <PageContainer maxWidth="7xl" className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon Dashboard</h1>
        <p className="text-gray-600">Bienvenue sur votre espace intervenant</p>
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
          <div className="text-gray-500">Chargement...</div>
        </div>
      ) : (
        <>
          {/* Statut */}
          <div className="mb-6">
            {getStatusBadge(intervenant?.status || "pending")}
            {intervenant?.status === "pending" && (
              <p className="text-sm text-gray-600 mt-2">
                Votre compte est en attente de validation par un administrateur.
              </p>
            )}
          </div>

          {/* Profil */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="p-6 lg:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Mon Profil
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {intervenant?.profileImage ? (
                    <img
                      src={intervenant.profileImage}
                      alt={fullName}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
                      <User className="w-10 h-10 text-indigo-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {fullName}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Mail className="w-4 h-4" />
                      <span>{user?.email}</span>
                    </div>
                  </div>
                </div>

                {intervenant?.bio && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      Biographie
                    </h4>
                    <p className="text-gray-600">{intervenant.bio}</p>
                  </div>
                )}

                {intervenant?.siret && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      SIRET
                    </h4>
                    <p className="text-gray-600">{intervenant.siret}</p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Actions rapides
              </h2>
              <div className="space-y-3">
                <Link to="/missions">
                  <Button variant="primary" className="w-full">
                    Voir les missions
                  </Button>
                </Link>
                <Button variant="secondary" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Mes documents
                </Button>
                <Button variant="secondary" className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Mes disponibilités
                </Button>
              </div>
            </Card>
          </div>

          {/* Stats simplifiées */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Missions acceptées
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {intervenant?.missions?.length || 0}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Documents uploadés
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {intervenant?.documents?.length || 0}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Statut</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">
                    {intervenant?.status || "En attente"}
                  </p>
                </div>
                <User className="w-8 h-8 text-indigo-400" />
              </div>
            </Card>
          </div>
        </>
      )}
    </PageContainer>
  );
}
