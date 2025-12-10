import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { getAllIntervenants, updateIntervenantStatus, type Intervenant } from "@/services/intervenants";
import { validateIntervenant } from "@/services/admin";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageContainer } from "@/components/ui/PageContainer";
import { CheckCircle, XCircle, Clock, User, Mail, FileText } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { useAuth } from "@/hooks/useAuth";

export default function AdminIntervenantsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [intervenants, setIntervenants] = useState<Intervenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchIntervenants();
  }, [filter]);

  const fetchIntervenants = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllIntervenants({
        status: filter !== "all" ? filter : undefined,
        take: 100,
      });
      setIntervenants(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors du chargement des intervenants";
      setError(errorMessage);
      console.error("Error fetching intervenants:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidate = async (id: string, status: "approved" | "rejected") => {
    try {
      setProcessingIds((prev) => new Set(prev).add(id));
      await validateIntervenant(id, status);
      await fetchIntervenants();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la validation";
      setError(errorMessage);
      console.error("Error validating intervenant:", err);
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3" />
            Approuvé
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3" />
            En attente
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3" />
            Rejeté
          </span>
        );
      default:
        return null;
    }
  };

  const getFullName = (intervenant: Intervenant) => {
    return (
      [intervenant.firstName, intervenant.lastName].filter(Boolean).join(" ") ||
      intervenant.user?.name ||
      intervenant.user?.email?.split("@")[0] ||
      "Intervenant"
    );
  };

  const pendingCount = intervenants.filter((i) => i.status === "pending").length;
  const approvedCount = intervenants.filter((i) => i.status === "approved").length;
  const rejectedCount = intervenants.filter((i) => i.status === "rejected").length;

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Intervenants</h1>
        <p className="text-gray-600">Approuvez ou rejetez les demandes d'inscription des intervenants</p>
      </div>

      {error && (
        <div className="mb-6">
          <Alert type="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </div>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{intervenants.length}</p>
            </div>
            <User className="w-8 h-8 text-gray-400" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approuvés</p>
              <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejetés</p>
              <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
        </Card>
      </div>

      {/* Filtres */}
      <div className="mb-6 flex gap-2">
        <Button
          variant={filter === "all" ? "primary" : "secondary"}
          onClick={() => setFilter("all")}
          size="sm"
        >
          Tous ({intervenants.length})
        </Button>
        <Button
          variant={filter === "pending" ? "primary" : "secondary"}
          onClick={() => setFilter("pending")}
          size="sm"
        >
          En attente ({pendingCount})
        </Button>
        <Button
          variant={filter === "approved" ? "primary" : "secondary"}
          onClick={() => setFilter("approved")}
          size="sm"
        >
          Approuvés ({approvedCount})
        </Button>
        <Button
          variant={filter === "rejected" ? "primary" : "secondary"}
          onClick={() => setFilter("rejected")}
          size="sm"
        >
          Rejetés ({rejectedCount})
        </Button>
      </div>

      {/* Liste des intervenants */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="text-gray-500">Chargement des intervenants...</div>
        </div>
      ) : intervenants.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500">Aucun intervenant trouvé.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {intervenants.map((intervenant) => {
            const isProcessing = processingIds.has(intervenant.id);
            const canApprove = intervenant.status !== "approved";
            const canReject = intervenant.status !== "rejected";

            return (
              <Card key={intervenant.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      {intervenant.profileImage ? (
                        <img
                          src={intervenant.profileImage}
                          alt={getFullName(intervenant)}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                          <User className="w-8 h-8 text-indigo-600" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {getFullName(intervenant)}
                          </h3>
                          {getStatusBadge(intervenant.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {intervenant.user?.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              <span>{intervenant.user.email}</span>
                            </div>
                          )}
                          {intervenant.siret && (
                            <div className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              <span>SIRET: {intervenant.siret}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {intervenant.bio && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{intervenant.bio}</p>
                    )}
                    <div className="text-xs text-gray-500">
                      Inscrit le {new Date(intervenant.createdAt || "").toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                  {intervenant.status === "pending" && (
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleValidate(intervenant.id, "approved")}
                        disabled={isProcessing}
                        isLoading={isProcessing}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approuver
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleValidate(intervenant.id, "rejected")}
                        disabled={isProcessing}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Rejeter
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}
