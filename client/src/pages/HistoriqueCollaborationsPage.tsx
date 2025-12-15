import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { getMyEcoleMissions, type Mission } from "@/services/missions";
import { getDocumentDownloadUrl, type Document } from "@/services/intervenants";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import {
  History,
  User,
  Calendar,
  CheckCircle,
  ArrowLeft,
  Search,
  Mail,
  ExternalLink,
  Target,
} from "lucide-react";

interface CollaborationWithDetails extends Mission {
  intervenant: {
    id: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    profileImage?: string;
    documents?: Document[];
    user?: {
      email: string;
    };
  };
}

export default function HistoriqueCollaborationsPage() {
  const { user } = useAuth();
  const [collaborations, setCollaborations] = useState<CollaborationWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "COMPLETED" | "ACTIVE">("all");

  useEffect(() => {
    fetchCollaborations();
  }, []);

  const fetchCollaborations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getMyEcoleMissions();
      const withIntervenants = (response.items || []).filter(
        (m): m is CollaborationWithDetails => m.intervenant !== null && m.intervenant !== undefined
      );
      setCollaborations(withIntervenants);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement de l'historique";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCollaborations = collaborations.filter((collab) => {
    if (statusFilter !== "all" && collab.status !== statusFilter) {
      return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const intervenantName = [collab.intervenant?.firstName, collab.intervenant?.lastName]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return (
        collab.title.toLowerCase().includes(query) ||
        intervenantName.includes(query) ||
        collab.intervenant?.user?.email?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const stats = {
    total: collaborations.length,
    completed: collaborations.filter((c) => c.status === "COMPLETED").length,
    active: collaborations.filter((c) => c.status === "ACTIVE").length,
  };

  const getProfileImageUrl = (intervenant: CollaborationWithDetails["intervenant"]) => {
    if (!intervenant) return null;

    if (intervenant.documents) {
      const documents = intervenant.documents as unknown as Document[];
      const profileDoc = documents.find((doc) => doc.type === "PROFILE_IMAGE");
      if (profileDoc) {
        return getDocumentDownloadUrl(intervenant.id, profileDoc.id);
      }
    }

    if (intervenant.profileImage?.startsWith("http")) {
      return intervenant.profileImage;
    }

    return null;
  };

  const getIntervenantName = (intervenant: CollaborationWithDetails["intervenant"]) => {
    if (!intervenant) return "Intervenant";
    return (
      [intervenant.firstName, intervenant.lastName].filter(Boolean).join(" ") ||
      intervenant.user?.email?.split("@")[0] ||
      "Intervenant"
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div style={{ backgroundColor: "#ebf2fa", minHeight: "100vh" }}>
      {/* Header compact */}
      <div style={{ backgroundColor: "#1c2942", minHeight: "150px" }} className="flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
          <Link
            to="/dashboard/ecole"
            className="inline-flex items-center gap-2 text-sm mb-3 transition-colors hover:opacity-80"
            style={{ color: "rgba(235, 242, 250, 0.7)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au dashboard
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#6d74b5" }}
              >
                <History className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Historique des collaborations</h1>
                <p className="text-sm" style={{ color: "rgba(235, 242, 250, 0.7)" }}>
                  Retrouvez toutes vos collaborations passées et en cours
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4">
              {[
                { value: stats.total, label: "Total" },
                { value: stats.completed, label: "Terminées" },
                { value: stats.active, label: "En cours" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 rounded-lg"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                >
                  <span className="text-lg font-bold text-white">{stat.value}</span>
                  <span className="text-sm ml-2" style={{ color: "rgba(235, 242, 250, 0.7)" }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <Alert type="error" onClose={() => setError(null)} className="mb-6">
            {error}
          </Alert>
        )}

        {/* Filtres */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{ backgroundColor: "#ffffff" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{ color: "#6d74b5" }}
              />
              <input
                type="text"
                placeholder="Rechercher par mission ou intervenant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2"
                style={{
                  borderColor: "#ebf2fa",
                  color: "#1c2942",
                }}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "primary" : "outline"}
                onClick={() => setStatusFilter("all")}
                className={`flex-1 ${statusFilter === "all" ? "bg-[#6d74b5] hover:bg-[#5a61a0]" : ""}`}
              >
                Toutes
              </Button>
              <Button
                variant={statusFilter === "COMPLETED" ? "primary" : "outline"}
                onClick={() => setStatusFilter("COMPLETED")}
                className={`flex-1 ${statusFilter === "COMPLETED" ? "bg-[#6d74b5] hover:bg-[#5a61a0]" : ""}`}
              >
                <CheckCircle className="w-4 h-4" />
                Terminées
              </Button>
              <Button
                variant={statusFilter === "ACTIVE" ? "primary" : "outline"}
                onClick={() => setStatusFilter("ACTIVE")}
                className={`flex-1 ${statusFilter === "ACTIVE" ? "bg-[#6d74b5] hover:bg-[#5a61a0]" : ""}`}
              >
                <Target className="w-4 h-4" />
                En cours
              </Button>
            </div>
          </div>
        </div>

        {/* Liste des collaborations */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 animate-pulse"
                style={{ backgroundColor: "#ffffff" }}
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-full" style={{ backgroundColor: "#ebf2fa" }} />
                  <div className="flex-1">
                    <div className="h-6 rounded w-1/3 mb-2" style={{ backgroundColor: "#ebf2fa" }} />
                    <div className="h-4 rounded w-1/2 mb-4" style={{ backgroundColor: "#ebf2fa" }} />
                    <div className="h-4 rounded w-2/3" style={{ backgroundColor: "#ebf2fa" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCollaborations.length === 0 ? (
          <div
            className="rounded-2xl p-16 text-center"
            style={{ backgroundColor: "#ffffff" }}
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: "#ebf2fa" }}
            >
              <History className="w-10 h-10" style={{ color: "#6d74b5" }} />
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: "#1c2942" }}>
              {searchQuery ? "Aucune collaboration trouvée" : "Pas encore de collaborations"}
            </h3>
            <p className="max-w-md mx-auto mb-8" style={{ color: "#6d74b5" }}>
              {searchQuery
                ? "Essayez de modifier vos critères de recherche"
                : "Créez des missions et assignez des intervenants pour voir vos collaborations ici."}
            </p>
            {!searchQuery && (
              <Link to="/nouvelle-mission">
                <Button
                  variant="primary"
                  size="lg"
                  style={{ backgroundColor: "#6d74b5" }}
                >
                  Créer une mission
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCollaborations.map((collab) => {
              const profileImageUrl = getProfileImageUrl(collab.intervenant);
              const intervenantName = getIntervenantName(collab.intervenant);

              return (
                <div
                  key={collab.id}
                  className="rounded-2xl p-6 hover:shadow-lg transition-shadow"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Photo et info intervenant */}
                    <div className="flex items-start gap-4">
                      <div className="shrink-0">
                        {profileImageUrl ? (
                          <img
                            src={profileImageUrl}
                            alt={intervenantName}
                            className="w-16 h-16 rounded-full object-cover border-2"
                            style={{ borderColor: "#ebf2fa" }}
                          />
                        ) : (
                          <div
                            className="w-16 h-16 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: "#ebf2fa" }}
                          >
                            <User className="w-8 h-8" style={{ color: "#6d74b5" }} />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold" style={{ color: "#1c2942" }}>
                          {intervenantName}
                        </h3>
                        {collab.intervenant?.user?.email && (
                          <p className="text-sm flex items-center gap-1" style={{ color: "#6d74b5" }}>
                            <Mail className="w-3 h-3" />
                            {collab.intervenant.user.email}
                          </p>
                        )}
                        <Link
                          to={`/intervenants/${collab.intervenant?.id}`}
                          className="text-sm flex items-center gap-1 mt-1 hover:underline"
                          style={{ color: "#6d74b5" }}
                        >
                          Voir le profil
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>

                    {/* Détails mission */}
                    <div
                      className="flex-1 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6"
                      style={{ borderColor: "#ebf2fa" }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor:
                                  collab.status === "COMPLETED" ? "#d1fae5" : "#ebf2fa",
                                color: collab.status === "COMPLETED" ? "#065f46" : "#6d74b5",
                              }}
                            >
                              {collab.status === "COMPLETED"
                                ? "Terminée"
                                : collab.status === "ACTIVE"
                                ? "En cours"
                                : collab.status}
                            </span>
                          </div>
                          <h4 className="font-semibold" style={{ color: "#1c2942" }}>
                            {collab.title}
                          </h4>
                          {collab.description && (
                            <p className="text-sm line-clamp-2 mt-1" style={{ color: "#6d74b5" }}>
                              {collab.description}
                            </p>
                          )}
                        </div>

                        {collab.priceCents && (
                          <div className="text-right shrink-0">
                            <span className="text-lg font-bold" style={{ color: "#1c2942" }}>
                              {(collab.priceCents / 100).toLocaleString("fr-FR")} €
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-4 mt-4 text-sm" style={{ color: "#6d74b5" }}>
                        {collab.startDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Début: {formatDate(collab.startDate)}
                          </span>
                        )}
                        {collab.endDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Fin: {formatDate(collab.endDate)}
                          </span>
                        )}
                      </div>
                    </div>
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
