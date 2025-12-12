import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { getMyEcoleMissions, type Mission } from "@/services/missions";
import { getDocumentDownloadUrl, type Document } from "@/services/intervenants";
import { PageContainer } from "@/components/ui/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import {
  History,
  User,
  Calendar,
  Building2,
  CheckCircle,
  FileText,
  Download,
  ArrowLeft,
  Search,
  Filter,
  Star,
  Mail,
  ExternalLink,
} from "lucide-react";
import { motion } from "motion/react";

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
      // Filtrer uniquement les missions avec un intervenant assigné
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
    // Filtre de statut
    if (statusFilter !== "all" && collab.status !== statusFilter) {
      return false;
    }

    // Filtre de recherche
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-mesh overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        </div>

        <PageContainer maxWidth="7xl" className="relative z-10 py-12">
          <Link
            to="/dashboard/ecole"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au dashboard
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <History className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Historique des collaborations
                </h1>
                <p className="text-indigo-100/80">
                  Retrouvez toutes vos collaborations passées et en cours
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mt-8">
              {[
                { value: stats.total, label: "Total", color: "bg-indigo-500/20" },
                { value: stats.completed, label: "Terminées", color: "bg-emerald-500/20" },
                { value: stats.active, label: "En cours", color: "bg-amber-500/20" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className={`${stat.color} backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3`}
                >
                  <span className="text-2xl font-bold text-white">{stat.value}</span>
                  <span className="text-sm text-white/70 ml-2">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </PageContainer>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent" />
      </div>

      <PageContainer maxWidth="7xl" className="py-8 -mt-8 relative z-20">
        {error && (
          <Alert type="error" onClose={() => setError(null)} className="mb-6">
            {error}
          </Alert>
        )}

        {/* Filtres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par mission ou intervenant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "primary" : "secondary"}
                onClick={() => setStatusFilter("all")}
                className="flex-1"
              >
                Toutes
              </Button>
              <Button
                variant={statusFilter === "COMPLETED" ? "primary" : "secondary"}
                onClick={() => setStatusFilter("COMPLETED")}
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4" />
                Terminées
              </Button>
              <Button
                variant={statusFilter === "ACTIVE" ? "primary" : "secondary"}
                onClick={() => setStatusFilter("ACTIVE")}
                className="flex-1"
              >
                En cours
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Liste des collaborations */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCollaborations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-gray-100 p-16 text-center"
          >
            <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <History className="w-10 h-10 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {searchQuery ? "Aucune collaboration trouvée" : "Pas encore de collaborations"}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              {searchQuery
                ? "Essayez de modifier vos critères de recherche"
                : "Créez des missions et assignez des intervenants pour voir vos collaborations ici."}
            </p>
            {!searchQuery && (
              <Link to="/nouvelle-mission">
                <Button variant="primary" size="lg">
                  Créer une mission
                </Button>
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredCollaborations.map((collab, index) => {
              const profileImageUrl = getProfileImageUrl(collab.intervenant);
              const intervenantName = getIntervenantName(collab.intervenant);

              return (
                <motion.div
                  key={collab.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Photo et info intervenant */}
                      <div className="flex items-start gap-4">
                        <div className="shrink-0">
                          {profileImageUrl ? (
                            <img
                              src={profileImageUrl}
                              alt={intervenantName}
                              className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                              <User className="w-8 h-8 text-indigo-600" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {intervenantName}
                          </h3>
                          {collab.intervenant?.user?.email && (
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {collab.intervenant.user.email}
                            </p>
                          )}
                          <Link
                            to={`/intervenants/${collab.intervenant?.id}`}
                            className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1 mt-1"
                          >
                            Voir le profil
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>

                      {/* Détails mission */}
                      <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  collab.status === "COMPLETED"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : collab.status === "ACTIVE"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {collab.status === "COMPLETED"
                                  ? "Terminée"
                                  : collab.status === "ACTIVE"
                                  ? "En cours"
                                  : collab.status}
                              </span>
                            </div>
                            <h4 className="font-semibold text-gray-900">{collab.title}</h4>
                            {collab.description && (
                              <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                                {collab.description}
                              </p>
                            )}
                          </div>

                          {collab.priceCents && (
                            <div className="text-right shrink-0">
                              <span className="text-lg font-bold text-gray-900">
                                {(collab.priceCents / 100).toLocaleString("fr-FR")} €
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
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
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </PageContainer>
    </div>
  );
}
