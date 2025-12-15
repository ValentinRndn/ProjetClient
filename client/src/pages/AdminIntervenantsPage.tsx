import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router";
import { getAllIntervenants, type Intervenant } from "@/services/intervenants";
import { validateIntervenant } from "@/services/admin";
import { Button } from "@/components/ui/Button";
import { CheckCircle, XCircle, Clock, User, Mail, FileText, UserCheck, ArrowLeft } from "lucide-react";
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
          <span
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: "#d1fae5", color: "#065f46" }}
          >
            <CheckCircle className="w-3 h-3" />
            Approuvé
          </span>
        );
      case "pending":
        return (
          <span
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: "#fef3c7", color: "#92400e" }}
          >
            <Clock className="w-3 h-3" />
            En attente
          </span>
        );
      case "rejected":
        return (
          <span
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: "#fef2f2", color: "#b91c1c" }}
          >
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
      <div style={{ backgroundColor: "#ebf2fa", minHeight: "100vh" }} className="flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: "#ebf2fa", borderTopColor: "#1c2942" }}
          />
          <p style={{ color: "#6d74b5" }}>Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#ebf2fa", minHeight: "100vh" }}>
      {/* Header compact */}
      <div style={{ backgroundColor: "#1c2942", minHeight: "150px" }} className="flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
          <Link
            to="/dashboard/admin"
            className="inline-flex items-center gap-2 text-sm mb-3 transition-colors hover:opacity-80"
            style={{ color: "rgba(235, 242, 250, 0.7)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au dashboard
          </Link>

          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#6d74b5" }}
            >
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Gestion des Intervenants</h1>
              <p className="text-sm" style={{ color: "rgba(235, 242, 250, 0.7)" }}>
                Approuvez ou rejetez les demandes d'inscription
              </p>
            </div>
          </div>

          {/* Stats inline */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-white/20">
            {[
              { value: intervenants.length, label: "Total" },
              { value: pendingCount, label: "En attente", highlight: pendingCount > 0 },
              { value: approvedCount, label: "Approuvés" },
              { value: rejectedCount, label: "Rejetés" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="px-3 py-1.5 rounded-lg"
                style={{ backgroundColor: stat.highlight ? "rgba(251, 191, 36, 0.2)" : "rgba(255, 255, 255, 0.1)" }}
              >
                <span
                  className="font-bold"
                  style={{ color: stat.highlight ? "#fbbf24" : "#ffffff" }}
                >
                  {stat.value}
                </span>
                <span
                  className="text-sm ml-2"
                  style={{ color: stat.highlight ? "#fbbf24" : "rgba(235, 242, 250, 0.7)" }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6">
            <Alert type="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </div>
        )}

        {/* Filtres */}
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { key: "all", label: `Tous (${intervenants.length})` },
            { key: "pending", label: `En attente (${pendingCount})` },
            { key: "approved", label: `Approuvés (${approvedCount})` },
            { key: "rejected", label: `Rejetés (${rejectedCount})` },
          ].map((item) => (
            <Button
              key={item.key}
              variant={filter === item.key ? "primary" : "secondary"}
              onClick={() => setFilter(item.key as typeof filter)}
              size="sm"
              className={filter === item.key ? "bg-[#6d74b5] hover:bg-[#5a61a0]" : ""}
              style={filter !== item.key ? { borderColor: "#ebf2fa" } : {}}
            >
              {item.label}
            </Button>
          ))}
        </div>

        {/* Liste des intervenants */}
        {isLoading ? (
          <div
            className="rounded-xl p-12 text-center"
            style={{ backgroundColor: "#ffffff" }}
          >
            <div
              className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4"
              style={{ borderColor: "#ebf2fa", borderTopColor: "#6d74b5" }}
            />
            <p style={{ color: "#6d74b5" }}>Chargement des intervenants...</p>
          </div>
        ) : intervenants.length === 0 ? (
          <div
            className="rounded-xl p-12 text-center"
            style={{ backgroundColor: "#ffffff" }}
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "#ebf2fa" }}
            >
              <UserCheck className="w-10 h-10" style={{ color: "#6d74b5" }} />
            </div>
            <p className="text-lg font-medium" style={{ color: "#1c2942" }}>
              Aucun intervenant trouvé
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {intervenants.map((intervenant) => {
              const isProcessing = processingIds.has(intervenant.id);

              return (
                <div
                  key={intervenant.id}
                  className="rounded-xl p-4 sm:p-6"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Avatar et infos */}
                    <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                      {intervenant.profileImage ? (
                        <img
                          src={intervenant.profileImage}
                          alt={getFullName(intervenant)}
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover shrink-0 border-2"
                          style={{ borderColor: "#ebf2fa" }}
                        />
                      ) : (
                        <div
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: "#ebf2fa" }}
                        >
                          <User className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#6d74b5" }} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-base sm:text-lg font-semibold truncate" style={{ color: "#1c2942" }}>
                            {getFullName(intervenant)}
                          </h3>
                          {getStatusBadge(intervenant.status)}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm" style={{ color: "#6d74b5" }}>
                          {intervenant.user?.email && (
                            <div className="flex items-center gap-1 min-w-0">
                              <Mail className="w-4 h-4 shrink-0" />
                              <span className="truncate">{intervenant.user.email}</span>
                            </div>
                          )}
                          {intervenant.siret && (
                            <div className="flex items-center gap-1">
                              <FileText className="w-4 h-4 shrink-0" />
                              <span className="text-xs sm:text-sm">SIRET: {intervenant.siret}</span>
                            </div>
                          )}
                        </div>
                        {intervenant.bio && (
                          <p className="text-sm mt-2 line-clamp-2 hidden sm:block" style={{ color: "#1c2942" }}>
                            {intervenant.bio}
                          </p>
                        )}
                        <div className="text-xs mt-2" style={{ color: "#6d74b5" }}>
                          Inscrit le {new Date(intervenant.createdAt || "").toLocaleDateString("fr-FR")}
                        </div>
                      </div>
                    </div>

                    {/* Boutons d'action */}
                    {intervenant.status === "pending" && (
                      <div className="flex gap-2 w-full sm:w-auto sm:shrink-0">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleValidate(intervenant.id, "approved")}
                          disabled={isProcessing}
                          isLoading={isProcessing}
                          className="flex-1 sm:flex-initial bg-emerald-500 hover:bg-emerald-600"
                        >
                          <CheckCircle className="w-4 h-4 sm:mr-1" />
                          <span className="hidden sm:inline">Approuver</span>
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleValidate(intervenant.id, "rejected")}
                          disabled={isProcessing}
                          className="flex-1 sm:flex-initial"
                          style={{ borderColor: "#ebf2fa" }}
                        >
                          <XCircle className="w-4 h-4 sm:mr-1" />
                          <span className="hidden sm:inline">Rejeter</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
