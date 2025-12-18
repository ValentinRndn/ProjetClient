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
  Mail,
  Handshake,
  Receipt,
  Phone,
  Headphones,
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
              <div className="w-14 h-14 bg-[#1c2942] rounded-xl flex items-center justify-center">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#1c2942]">{ecoleName}</h1>
                <div className="flex items-center gap-2 text-sm text-[#1c2942]/60">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link to="/intervenants">
                <Button variant="outline" size="md" className="border-[#1c2942]/20 text-[#1c2942] hover:bg-[#ebf2fa]">
                  <Users className="w-4 h-4" />
                  Trouver un intervenant
                </Button>
              </Link>
              <Link to="/collaborations">
                <Button variant="outline" size="md" className="border-[#1c2942]/20 text-[#1c2942] hover:bg-[#ebf2fa]">
                  <Handshake className="w-4 h-4" />
                  Mes collaborations
                </Button>
              </Link>
              <Link to="/nouvelle-mission">
                <Button variant="primary" size="md" className="bg-[#6d74b5] hover:bg-[#5a61a0]">
                  <Plus className="w-4 h-4" />
                  Nouvelle mission
                </Button>
              </Link>
            </div>
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

        {/* Contacts Vizion Academy */}
        <div className="bg-white rounded-2xl border border-[#1c2942]/10 shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#6d74b5] rounded-xl flex items-center justify-center">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-[#1c2942]">Contacts Vizion Academy</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Mickael */}
            <div className="bg-[#ebf2fa] rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-[#1c2942] rounded-full flex items-center justify-center text-white font-bold text-lg">
                  MN
                </div>
                <div>
                  <h3 className="font-bold text-[#1c2942]">Mickael NOGUEIRA</h3>
                  <p className="text-sm text-[#1c2942]/60">Gestion des intervenants</p>
                </div>
              </div>
              <a
                href="tel:0684889694"
                className="flex items-center gap-2 text-[#6d74b5] hover:text-[#1c2942] font-medium transition-colors"
              >
                <Phone className="w-4 h-4" />
                06 84 88 96 94
              </a>
            </div>

            {/* Guillaume */}
            <div className="bg-[#ebf2fa] rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-[#6d74b5] rounded-full flex items-center justify-center text-white font-bold text-lg">
                  GR
                </div>
                <div>
                  <h3 className="font-bold text-[#1c2942]">Guillaume ROURE</h3>
                  <p className="text-sm text-[#1c2942]/60">Écoles & Challenges</p>
                </div>
              </div>
              <a
                href="tel:0659196550"
                className="flex items-center gap-2 text-[#6d74b5] hover:text-[#1c2942] font-medium transition-colors"
              >
                <Phone className="w-4 h-4" />
                06 59 19 65 50
              </a>
            </div>

            {/* Narjesse */}
            <div className="bg-[#ebf2fa] rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  NM
                </div>
                <div>
                  <h3 className="font-bold text-[#1c2942]">Narjesse MALKI</h3>
                  <p className="text-sm text-[#1c2942]/60">Facturation & Admin</p>
                </div>
              </div>
              <a
                href="tel:0650717742"
                className="flex items-center gap-2 text-[#6d74b5] hover:text-[#1c2942] font-medium transition-colors"
              >
                <Phone className="w-4 h-4" />
                06 50 71 77 42
              </a>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-[#1c2942]/10 p-6 animate-pulse">
              <div className="h-6 bg-[#ebf2fa] rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                <div className="h-24 bg-[#ebf2fa] rounded"></div>
                <div className="h-24 bg-[#ebf2fa] rounded"></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-[#1c2942]/10 p-6 animate-pulse">
              <div className="h-6 bg-[#ebf2fa] rounded w-1/2 mb-6"></div>
              <div className="space-y-3">
                <div className="h-16 bg-[#ebf2fa] rounded-xl"></div>
                <div className="h-16 bg-[#ebf2fa] rounded-xl"></div>
                <div className="h-16 bg-[#ebf2fa] rounded-xl"></div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Missions récentes */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-[#1c2942]/10 shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#ebf2fa] rounded-xl flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-[#6d74b5]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1c2942]">Mes missions récentes</h2>
                  </div>
                  <Link to="/mes-missions">
                    <Button variant="outline" size="sm" className="rounded-xl">
                      Voir tout
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {missions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-[#ebf2fa] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="w-8 h-8 text-[#6d74b5]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1c2942] mb-2">Aucune mission</h3>
                    <p className="text-[#1c2942]/60 mb-6">
                      Commencez par créer votre première mission
                    </p>
                    <Link to="/nouvelle-mission">
                      <Button variant="primary" className="bg-[#6d74b5] hover:bg-[#5a61a0]">
                        <Plus className="w-4 h-4" />
                        Créer une mission
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {missions.slice(0, 3).map((mission) => (
                      <MissionCard
                        key={mission.id}
                        mission={mission}
                        showApplyButton={false}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Actions rapides */}
              <div className="bg-white rounded-2xl border border-[#1c2942]/10 shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#ebf2fa] rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[#6d74b5]" />
                  </div>
                  <h2 className="text-xl font-bold text-[#1c2942]">Actions rapides</h2>
                </div>

                <div className="space-y-3">
                  <Link to="/nouvelle-mission" className="block group">
                    <div className="flex items-center justify-between p-4 bg-[#ebf2fa] hover:bg-[#ebf2fa]/70 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#1c2942] rounded-lg flex items-center justify-center">
                          <Plus className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-[#1c2942]">Proposer une mission</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#6d74b5] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>

                  <Link to="/intervenants" className="block group">
                    <div className="flex items-center justify-between p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-[#1c2942]">Trouver un intervenant</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>

                  <Link to="/collaborations" className="block group">
                    <div className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                          <Handshake className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-[#1c2942]">Mes collaborations</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>

                  <Link to="/mes-missions" className="block group">
                    <div className="flex items-center justify-between p-4 bg-[#ebf2fa] hover:bg-[#ebf2fa]/70 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#6d74b5] rounded-lg flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-[#1c2942]">Gérer mes missions</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#6d74b5] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>

                  <Link to="/dashboard/ecole/factures" className="block group">
                    <div className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                          <Receipt className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-[#1c2942]">Mes factures</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>

                  <Link to="/dashboard/ecole/favoris" className="block group">
                    <div className="flex items-center justify-between p-4 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-500 rounded-lg flex items-center justify-center">
                          <Heart className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-[#1c2942]">Mes favoris</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-rose-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>

                  <Link to="/dashboard/ecole/historique" className="block group">
                    <div className="flex items-center justify-between p-4 bg-[#ebf2fa] hover:bg-[#ebf2fa]/70 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#1c2942] rounded-lg flex items-center justify-center">
                          <History className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-[#1c2942]">Historique</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#6d74b5] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </PageContainer>
    </div>
  );
}
