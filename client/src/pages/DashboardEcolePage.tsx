import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { getMyEcoleMissions, type Mission } from "@/services/missions";
import { PageContainer } from "@/components/ui/PageContainer";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { MissionCard } from "@/components/features/MissionCard";
import {
  Building2,
  Briefcase,
  Plus,
  Users,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Target,
  History,
  Heart,
} from "lucide-react";

export default function DashboardEcolePage() {
  const { user } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getMyEcoleMissions();
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

  const stats = {
    total: missions.length,
    active: missions.filter((m) => m.status === "ACTIVE").length,
    completed: missions.filter((m) => m.status === "COMPLETED").length,
    draft: missions.filter((m) => m.status === "DRAFT").length,
    withIntervenant: missions.filter((m) => m.intervenant).length,
  };

  const ecoleName = user?.ecole?.name || "Mon École";

  return (
    <div className="min-h-screen bg-[#ebf2fa]">
      <PageContainer maxWidth="7xl" className="py-8">
        {/* Header compact */}
        <div className="bg-white rounded-2xl border border-[#1c2942]/10 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#1c2942] rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#1c2942]">{ecoleName}</h1>
                <p className="text-sm text-[#1c2942]/60">Espace École</p>
              </div>
            </div>

            <Link to="/nouvelle-mission">
              <Button variant="primary" size="md">
                <Plus className="w-4 h-4" />
                Nouvelle mission
              </Button>
            </Link>
          </div>

          {/* Stats inline */}
          <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t border-[#1c2942]/10">
            {[
              { icon: <Briefcase className="w-4 h-4" />, value: stats.total, label: "Total" },
              { icon: <Target className="w-4 h-4" />, value: stats.active, label: "Actives" },
              { icon: <CheckCircle className="w-4 h-4" />, value: stats.completed, label: "Terminées" },
              { icon: <Users className="w-4 h-4" />, value: stats.withIntervenant, label: "Assignées" },
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-[#6d74b5]">{stat.icon}</span>
                <span className="font-bold text-[#1c2942]">{stat.value}</span>
                <span className="text-sm text-[#1c2942]/60">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
        {error && (
          <div className="mb-6">
            <Alert type="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </div>
        )}

        {/* Actions rapides */}
        <div className="bg-white rounded-2xl border border-[#1c2942]/10 shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#ebf2fa] rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#6d74b5]" />
            </div>
            <h2 className="text-xl font-bold text-[#1c2942]">Actions rapides</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Link to="/nouvelle-mission" className="group">
              <div className="flex items-center justify-between p-4 bg-[#ebf2fa] hover:bg-[#ebf2fa]/70 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1c2942] rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1c2942]">Proposer une mission</p>
                    <p className="text-sm text-[#1c2942]/60">Créer une nouvelle mission</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[#6d74b5] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link to="/intervenants" className="group">
              <div className="flex items-center justify-between p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1c2942]">Trouver un intervenant</p>
                    <p className="text-sm text-[#1c2942]/60">Parcourir les profils</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link to="/dashboard/ecole/favoris" className="group">
              <div className="flex items-center justify-between p-4 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-500 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1c2942]">Mes favoris</p>
                    <p className="text-sm text-[#1c2942]/60">Intervenants favoris</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-rose-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link to="/missions" className="group">
              <div className="flex items-center justify-between p-4 bg-[#ebf2fa] hover:bg-[#ebf2fa]/70 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#6d74b5] rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1c2942]">Voir les missions</p>
                    <p className="text-sm text-[#1c2942]/60">Toutes les missions</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[#6d74b5] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link to="/dashboard/ecole/historique" className="group">
              <div className="flex items-center justify-between p-4 bg-[#ebf2fa] hover:bg-[#ebf2fa]/70 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1c2942] rounded-lg flex items-center justify-center">
                    <History className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1c2942]">Historique</p>
                    <p className="text-sm text-[#1c2942]/60">Mes collaborations</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[#6d74b5] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* Liste des missions */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1c2942]">Mes missions récentes</h2>
            <Link to="/mes-missions">
              <Button variant="outline" size="sm" className="rounded-xl">
                Voir tout
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#1c2942]/10 p-6 animate-pulse">
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-[#ebf2fa] rounded-full w-20"></div>
                  </div>
                  <div className="h-6 bg-[#ebf2fa] rounded w-3/4 mb-4"></div>
                  <div className="h-16 bg-[#ebf2fa] rounded mb-4"></div>
                  <div className="h-4 bg-[#ebf2fa] rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : missions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#1c2942]/10 p-16 text-center">
              <div className="w-20 h-20 bg-[#ebf2fa] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10 text-[#6d74b5]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1c2942] mb-3">
                Aucune mission
              </h3>
              <p className="text-[#1c2942]/60 max-w-md mx-auto mb-8">
                Vous n'avez pas encore créé de mission. Commencez maintenant pour trouver les meilleurs intervenants !
              </p>
              <Link to="/nouvelle-mission">
                <Button variant="primary" size="lg" className="px-8">
                  <Plus className="w-5 h-5" />
                  Proposer une mission
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {missions.slice(0, 6).map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  showApplyButton={false}
                />
              ))}
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
}
