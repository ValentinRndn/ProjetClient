import { useEffect, useState } from "react";
import { getAllMissions, getPublicMissions, applyToMission, type Mission, type MissionStatus } from "@/services/missions";
import { MissionCard } from "@/components/features/MissionCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Search, Briefcase, Filter, Target, LogIn, UserPlus, ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";

export default function MissionsPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<MissionStatus | "all">("ACTIVE");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState<string | null>(null);

  useEffect(() => {
    fetchMissions();
  }, [statusFilter, isAuthenticated]);

  const fetchMissions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let response;
      if (isAuthenticated) {
        response = await getAllMissions({
          status: statusFilter !== "all" ? statusFilter : undefined,
          take: 50,
        });
      } else {
        response = await getPublicMissions({
          take: 50,
        });
      }

      setMissions(response.items || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des missions";
      setError(errorMessage);
      console.error("Error fetching missions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async (missionId: string) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!window.confirm("Voulez-vous envoyer votre candidature pour cette mission ? L'école pourra ensuite l'accepter ou la refuser.")) {
      return;
    }

    try {
      setIsApplying(missionId);
      setError(null);
      await applyToMission(missionId);

      setSuccessMessage("Votre candidature a été envoyée ! L'école vous contactera si elle accepte votre profil.");
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: unknown) {
      console.error("Erreur postuler:", err);
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message: string }).message
        : "Erreur lors de la candidature. Vérifiez que votre profil est approuvé.";
      setError(errorMessage);
    } finally {
      setIsApplying(null);
    }
  };

  const filteredMissions = missions.filter((mission) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      mission.title.toLowerCase().includes(query) ||
      mission.description?.toLowerCase().includes(query) ||
      mission.ecole?.name.toLowerCase().includes(query)
    );
  });

  const activeCount = missions.filter((m) => m.status === "ACTIVE").length;
  const completedCount = missions.filter((m) => m.status === "COMPLETED").length;

  return (
    <div style={{ backgroundColor: "#ebf2fa", minHeight: "100vh" }}>
      {/* Header avec bannière */}
      <div style={{ backgroundColor: "#1c2942", minHeight: "150px" }} className="flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-sm mb-3 transition-colors hover:opacity-80"
              style={{ color: "rgba(235, 242, 250, 0.7)" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au dashboard
            </Link>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#6d74b5" }}
              >
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Mur des Missions</h1>
                <p className="text-sm" style={{ color: "rgba(235, 242, 250, 0.7)" }}>
                  Découvrez les opportunités d'intervention
                </p>
              </div>
            </div>
          </div>

          {/* Stats inline */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-white/20">
            {[
              { icon: <Target className="w-4 h-4" />, value: activeCount, label: "Actives", highlight: activeCount > 0 },
              { icon: <Briefcase className="w-4 h-4" />, value: completedCount, label: "Terminées" },
              { icon: <Briefcase className="w-4 h-4" />, value: missions.length, label: "Total" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="px-3 py-1.5 rounded-lg"
                style={{ backgroundColor: stat.highlight ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.1)" }}
              >
                <span
                  className="mr-2"
                  style={{ color: stat.highlight ? "#10b981" : "rgba(235, 242, 250, 0.7)" }}
                >
                  {stat.icon}
                </span>
                <span
                  className="font-bold"
                  style={{ color: stat.highlight ? "#10b981" : "#ffffff" }}
                >
                  {stat.value}
                </span>
                <span
                  className="text-sm ml-2"
                  style={{ color: stat.highlight ? "#10b981" : "rgba(235, 242, 250, 0.7)" }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Alerts */}
        {error && (
          <div className="mb-6">
            <Alert type="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </div>
        )}

        {successMessage && (
          <div className="mb-6">
            <Alert type="success" onClose={() => setSuccessMessage(null)}>
              {successMessage}
            </Alert>
          </div>
        )}

        {/* Filters */}
        <div
          className="rounded-xl p-4 mb-6"
          style={{ backgroundColor: "#ffffff" }}
        >
          <div className={`grid grid-cols-1 ${isAuthenticated ? "md:grid-cols-4" : "md:grid-cols-1"} gap-4`}>
            <div className={`relative ${isAuthenticated ? "md:col-span-2" : ""}`}>
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{ color: "#6d74b5" }}
              />
              <Input
                type="text"
                placeholder="Rechercher par titre, description, école..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-xl"
                style={{ borderColor: "#ebf2fa" }}
              />
            </div>
            {isAuthenticated && (
              <div className="flex gap-2 md:col-span-2">
                <Button
                  variant={statusFilter === "ACTIVE" ? "primary" : "secondary"}
                  onClick={() => setStatusFilter("ACTIVE")}
                  className={`flex-1 h-12 rounded-xl ${statusFilter === "ACTIVE" ? "bg-[#6d74b5] hover:bg-[#5a61a0]" : ""}`}
                  style={statusFilter !== "ACTIVE" ? { borderColor: "#ebf2fa" } : {}}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Actives
                </Button>
                <Button
                  variant={statusFilter === "all" ? "primary" : "secondary"}
                  onClick={() => setStatusFilter("all")}
                  className={`flex-1 h-12 rounded-xl ${statusFilter === "all" ? "bg-[#6d74b5] hover:bg-[#5a61a0]" : ""}`}
                  style={statusFilter !== "all" ? { borderColor: "#ebf2fa" } : {}}
                >
                  Toutes
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <span style={{ color: "#6d74b5" }} className="font-medium">
            {filteredMissions.length} mission{filteredMissions.length > 1 ? "s" : ""} trouvée{filteredMissions.length > 1 ? "s" : ""}
          </span>
        </div>

        {/* Mission Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl p-6 animate-pulse"
                style={{ backgroundColor: "#ffffff" }}
              >
                <div className="flex gap-2 mb-4">
                  <div className="h-6 rounded-full w-20" style={{ backgroundColor: "#ebf2fa" }}></div>
                  <div className="h-6 rounded-full w-16" style={{ backgroundColor: "#ebf2fa" }}></div>
                </div>
                <div className="h-6 rounded w-3/4 mb-4" style={{ backgroundColor: "#ebf2fa" }}></div>
                <div className="h-4 rounded w-1/2 mb-4" style={{ backgroundColor: "#ebf2fa" }}></div>
                <div className="h-16 rounded mb-4" style={{ backgroundColor: "#ebf2fa" }}></div>
                <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: "#ebf2fa" }}>
                  <div className="h-4 rounded w-24" style={{ backgroundColor: "#ebf2fa" }}></div>
                  <div className="h-9 rounded-lg w-24" style={{ backgroundColor: "#ebf2fa" }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredMissions.length === 0 ? (
          <div
            className="rounded-xl p-16 text-center"
            style={{ backgroundColor: "#ffffff" }}
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: "#ebf2fa" }}
            >
              <Briefcase className="w-10 h-10" style={{ color: "#6d74b5" }} />
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: "#1c2942" }}>
              Aucune mission trouvée
            </h3>
            <p className="max-w-md mx-auto" style={{ color: "#6d74b5" }}>
              {searchQuery
                ? "Essayez de modifier vos critères de recherche pour découvrir plus d'opportunités"
                : "Il n'y a pas de missions disponibles pour le moment. Revenez bientôt !"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMissions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onApply={handleApply}
                showApplyButton={user?.role === "INTERVENANT"}
                isApplying={isApplying === mission.id}
              />
            ))}
          </div>
        )}

        {/* CTA pour les visiteurs non connectés */}
        {!isAuthenticated && (
          <div
            className="mt-8 rounded-xl p-8 text-center"
            style={{ backgroundColor: "#ffffff" }}
          >
            <h2 className="text-xl font-bold mb-2" style={{ color: "#1c2942" }}>
              Intéressé par ces missions ?
            </h2>
            <p className="max-w-xl mx-auto mb-6" style={{ color: "#6d74b5" }}>
              Créez votre compte intervenant gratuitement et postulez directement aux missions qui vous intéressent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register/intervenant">
                <Button variant="primary" size="lg" className="bg-[#6d74b5] hover:bg-[#5a61a0]">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Devenir intervenant
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg" style={{ borderColor: "#ebf2fa" }}>
                  <LogIn className="w-5 h-5 mr-2" />
                  Se connecter
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
