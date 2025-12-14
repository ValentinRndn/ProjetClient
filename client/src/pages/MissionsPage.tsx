import { useEffect, useState } from "react";
import { getAllMissions, getPublicMissions, applyToMission, type Mission, type MissionStatus } from "@/services/missions";
import { MissionCard } from "@/components/features/MissionCard";
import { PageContainer } from "@/components/ui/PageContainer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Search, Briefcase, Filter, Target, LogIn, UserPlus } from "lucide-react";
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

    if (!window.confirm("En postulant, vous serez directement assigné à cette mission. Voulez-vous continuer ?")) {
      return;
    }

    try {
      setIsApplying(missionId);
      setError(null);
      const updatedMission = await applyToMission(missionId);

      setMissions(missions.map(m =>
        m.id === missionId ? updatedMission : m
      ));

      setSuccessMessage("Vous avez été assigné à cette mission avec succès !");
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

  return (
    <div className="min-h-screen bg-[#ebf2fa]">
      <PageContainer maxWidth="7xl" className="py-8">
        {/* Header compact */}
        <div className="bg-white rounded-2xl border border-[#1c2942]/10 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#1c2942] rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#1c2942]">Mur des Missions</h1>
                <p className="text-sm text-[#1c2942]/60">Découvrez les opportunités d'intervention</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#ebf2fa] rounded-lg">
                <Target className="w-4 h-4 text-[#6d74b5]" />
                <span className="font-bold text-[#1c2942]">{activeCount}</span>
                <span className="text-sm text-[#1c2942]/60">actives</span>
              </div>
            </div>
          </div>
        </div>

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
        <div className="bg-white rounded-2xl border border-[#1c2942]/10 p-4 mb-6">
          <div className={`grid grid-cols-1 ${isAuthenticated ? "md:grid-cols-4" : "md:grid-cols-1"} gap-4`}>
            <div className={`relative ${isAuthenticated ? "md:col-span-2" : ""}`}>
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#1c2942]/40 w-5 h-5" />
              <Input
                type="text"
                placeholder="Rechercher par titre, description, école..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-xl border-[#1c2942]/10 focus:border-[#6d74b5] focus:ring-[#6d74b5]/20"
              />
            </div>
            {isAuthenticated && (
              <div className="flex gap-2 md:col-span-2">
                <Button
                  variant={statusFilter === "ACTIVE" ? "primary" : "outline"}
                  onClick={() => setStatusFilter("ACTIVE")}
                  className={`flex-1 h-12 rounded-xl ${statusFilter === "ACTIVE" ? "bg-[#6d74b5] hover:bg-[#5a61a0]" : ""}`}
                >
                  <Filter className="w-4 h-4" />
                  Actives
                </Button>
                <Button
                  variant={statusFilter === "all" ? "primary" : "outline"}
                  onClick={() => setStatusFilter("all")}
                  className={`flex-1 h-12 rounded-xl ${statusFilter === "all" ? "bg-[#6d74b5] hover:bg-[#5a61a0]" : ""}`}
                >
                  Toutes
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-[#1c2942]/60 font-medium">
            {filteredMissions.length} mission{filteredMissions.length > 1 ? "s" : ""} trouvée{filteredMissions.length > 1 ? "s" : ""}
          </span>
        </div>

        {/* Mission Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#1c2942]/10 p-6 animate-pulse">
                <div className="flex gap-2 mb-4">
                  <div className="h-6 bg-[#ebf2fa] rounded-full w-20"></div>
                  <div className="h-6 bg-[#ebf2fa] rounded-full w-16"></div>
                </div>
                <div className="h-6 bg-[#ebf2fa] rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-[#ebf2fa] rounded w-1/2 mb-4"></div>
                <div className="h-16 bg-[#ebf2fa] rounded mb-4"></div>
                <div className="flex justify-between items-center pt-4 border-t border-[#1c2942]/10">
                  <div className="h-4 bg-[#ebf2fa] rounded w-24"></div>
                  <div className="h-9 bg-[#ebf2fa] rounded-lg w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredMissions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#1c2942]/10 p-16 text-center">
            <div className="w-20 h-20 bg-[#ebf2fa] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-[#6d74b5]" />
            </div>
            <h3 className="text-2xl font-bold text-[#1c2942] mb-3">
              Aucune mission trouvée
            </h3>
            <p className="text-[#1c2942]/60 max-w-md mx-auto">
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
          <div className="mt-8 bg-white rounded-2xl border border-[#1c2942]/10 p-8 text-center">
            <h2 className="text-xl font-bold text-[#1c2942] mb-2">
              Intéressé par ces missions ?
            </h2>
            <p className="text-[#1c2942]/60 max-w-xl mx-auto mb-6">
              Créez votre compte intervenant gratuitement et postulez directement aux missions qui vous intéressent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register/intervenant">
                <Button variant="primary" size="lg" className="bg-[#6d74b5] hover:bg-[#5a61a0]">
                  <UserPlus className="w-5 h-5" />
                  Devenir intervenant
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  <LogIn className="w-5 h-5" />
                  Se connecter
                </Button>
              </Link>
            </div>
          </div>
        )}
      </PageContainer>
    </div>
  );
}
