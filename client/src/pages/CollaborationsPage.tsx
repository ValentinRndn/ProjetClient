/**
 * Page de liste des collaborations
 * Partagée entre écoles et intervenants
 */
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import {
  getMyCollaborations,
  type Collaboration,
  type CollaborationStatus,
} from "@/services/collaborations";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import {
  Handshake,
  Plus,
  ArrowLeft,
  Building2,
  User,
  Calendar,
  Euro,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Filter,
  ArrowRight,
} from "lucide-react";

const STATUS_CONFIG: Record<
  CollaborationStatus,
  { label: string; color: string; bgColor: string; icon: React.ReactNode }
> = {
  brouillon: {
    label: "Brouillon",
    color: "#6d74b5",
    bgColor: "rgba(109, 116, 181, 0.1)",
    icon: <FileText className="w-4 h-4" />,
  },
  en_cours: {
    label: "En cours",
    color: "#10b981",
    bgColor: "rgba(16, 185, 129, 0.1)",
    icon: <Clock className="w-4 h-4" />,
  },
  terminee: {
    label: "Terminée",
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.1)",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  annulee: {
    label: "Annulée",
    color: "#ef4444",
    bgColor: "rgba(239, 68, 68, 0.1)",
    icon: <XCircle className="w-4 h-4" />,
  },
};

export default function CollaborationsPage() {
  const { user } = useAuth();
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<CollaborationStatus | "all">("all");

  const isEcole = user?.role === "ECOLE";
  const isIntervenant = user?.role === "INTERVENANT";

  useEffect(() => {
    fetchCollaborations();
  }, [statusFilter]);

  const fetchCollaborations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getMyCollaborations(
        statusFilter !== "all" ? statusFilter : undefined
      );
      setCollaborations(response.items || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des collaborations";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatMontant = (cents?: number) => {
    if (!cents) return "-";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(cents / 100);
  };

  const stats = {
    total: collaborations.length,
    brouillon: collaborations.filter((c) => c.status === "brouillon").length,
    enCours: collaborations.filter((c) => c.status === "en_cours").length,
    terminee: collaborations.filter((c) => c.status === "terminee").length,
  };

  const dashboardLink = isEcole ? "/dashboard/ecole" : "/dashboard/intervenant";

  return (
    <div style={{ backgroundColor: "#ebf2fa", minHeight: "100vh" }}>
      {/* Header avec bannière */}
      <div
        style={{ backgroundColor: "#1c2942", minHeight: "150px" }}
        className="flex items-center"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
          <Link
            to={dashboardLink}
            className="inline-flex items-center gap-2 text-sm mb-3 transition-colors hover:opacity-80"
            style={{ color: "rgba(235, 242, 250, 0.7)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au tableau de bord
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#6d74b5" }}
              >
                <Handshake className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Mes Collaborations</h1>
                <p className="text-sm" style={{ color: "rgba(235, 242, 250, 0.7)" }}>
                  Gérez vos collaborations avec {isEcole ? "les intervenants" : "les écoles"}
                </p>
              </div>
            </div>

            <Link to="/collaborations/nouvelle">
              <Button
                variant="secondary"
                size="sm"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Déclarer une collaboration
              </Button>
            </Link>
          </div>

          {/* Stats inline */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-white/20">
            {[
              { value: stats.total, label: "Total" },
              {
                value: stats.brouillon,
                label: "Brouillons",
                highlight: stats.brouillon > 0,
                color: "#6d74b5",
              },
              {
                value: stats.enCours,
                label: "En cours",
                highlight: stats.enCours > 0,
                color: "#10b981",
              },
              { value: stats.terminee, label: "Terminées" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="px-3 py-1.5 rounded-lg"
                style={{
                  backgroundColor: stat.highlight
                    ? `${stat.color}20`
                    : "rgba(255, 255, 255, 0.1)",
                }}
              >
                <span
                  className="font-bold"
                  style={{ color: stat.highlight ? stat.color : "#ffffff" }}
                >
                  {stat.value}
                </span>
                <span
                  className="text-sm ml-2"
                  style={{
                    color: stat.highlight ? stat.color : "rgba(235, 242, 250, 0.7)",
                  }}
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
        <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: "#ffffff" }}>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={statusFilter === "all" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setStatusFilter("all")}
              className={statusFilter === "all" ? "bg-[#6d74b5]" : ""}
              style={statusFilter !== "all" ? { borderColor: "#ebf2fa" } : {}}
            >
              <Filter className="w-4 h-4 mr-2" />
              Toutes
            </Button>
            {(Object.keys(STATUS_CONFIG) as CollaborationStatus[]).map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "primary" : "secondary"}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className={statusFilter === status ? "bg-[#6d74b5]" : ""}
                style={statusFilter !== status ? { borderColor: "#ebf2fa" } : {}}
              >
                {STATUS_CONFIG[status].icon}
                <span className="ml-2">{STATUS_CONFIG[status].label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Liste des collaborations */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl p-6 animate-pulse"
                style={{ backgroundColor: "#ffffff" }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div
                      className="h-6 rounded w-1/3 mb-2"
                      style={{ backgroundColor: "#ebf2fa" }}
                    ></div>
                    <div
                      className="h-4 rounded w-1/4"
                      style={{ backgroundColor: "#ebf2fa" }}
                    ></div>
                  </div>
                  <div
                    className="h-8 rounded-full w-24"
                    style={{ backgroundColor: "#ebf2fa" }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : collaborations.length === 0 ? (
          <div className="rounded-xl p-16 text-center" style={{ backgroundColor: "#ffffff" }}>
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: "#ebf2fa" }}
            >
              <Handshake className="w-10 h-10" style={{ color: "#6d74b5" }} />
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: "#1c2942" }}>
              Aucune collaboration
            </h3>
            <p className="max-w-md mx-auto mb-6" style={{ color: "#6d74b5" }}>
              {statusFilter !== "all"
                ? `Vous n'avez pas de collaboration avec le statut "${STATUS_CONFIG[statusFilter].label}"`
                : "Déclarez votre première collaboration pour garder une trace de vos interventions."}
            </p>
            {statusFilter === "all" && (
              <Link to="/collaborations/nouvelle">
                <Button variant="primary" className="bg-[#6d74b5] hover:bg-[#5a61a0]">
                  <Plus className="w-4 h-4 mr-2" />
                  Déclarer une collaboration
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {collaborations.map((collab) => {
              const statusConfig = STATUS_CONFIG[collab.status];
              const partnerName = isEcole
                ? `${collab.intervenant?.firstName || ""} ${collab.intervenant?.lastName || ""}`.trim() ||
                  collab.intervenant?.user?.email
                : collab.ecole?.name;

              return (
                <Link
                  key={collab.id}
                  to={`/collaborations/${collab.id}`}
                  className="block rounded-xl p-6 transition-shadow hover:shadow-lg"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3
                          className="text-lg font-bold"
                          style={{ color: "#1c2942" }}
                        >
                          {collab.titre}
                        </h3>
                        <span
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: statusConfig.bgColor,
                            color: statusConfig.color,
                          }}
                        >
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          {isEcole ? (
                            <User className="w-4 h-4" style={{ color: "#6d74b5" }} />
                          ) : (
                            <Building2 className="w-4 h-4" style={{ color: "#6d74b5" }} />
                          )}
                          <span style={{ color: "#1c2942" }}>{partnerName}</span>
                        </div>

                        {(collab.dateDebut || collab.dateFin) && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" style={{ color: "#6d74b5" }} />
                            <span style={{ color: "#6d74b5" }}>
                              {formatDate(collab.dateDebut)}
                              {collab.dateFin && ` - ${formatDate(collab.dateFin)}`}
                            </span>
                          </div>
                        )}

                        {collab.montantHT && (
                          <div className="flex items-center gap-2">
                            <Euro className="w-4 h-4" style={{ color: "#6d74b5" }} />
                            <span style={{ color: "#6d74b5" }}>
                              {formatMontant(collab.montantHT)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Validation status */}
                      {collab.status === "brouillon" && (
                        <div className="flex items-center gap-4 mt-3">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              collab.validatedByEcole
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {collab.validatedByEcole ? "✓ École validée" : "École en attente"}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              collab.validatedByIntervenant
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {collab.validatedByIntervenant
                              ? "✓ Intervenant validé"
                              : "Intervenant en attente"}
                          </span>
                        </div>
                      )}
                    </div>

                    <ArrowRight className="w-5 h-5" style={{ color: "#6d74b5" }} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
