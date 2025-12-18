import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getIntervenantById } from "@/services/intervenants";
import { PageContainer } from "@/components/ui/PageContainer";
import { Button } from "@/components/ui/Button";
import {
  User,
  Mail,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Sparkles,
  Briefcase,
  ArrowRight,
  Target,
  Award,
  Building2,
  Calculator,
  Receipt,
  CalendarClock,
  AlertTriangle,
  Handshake,
  Phone,
  Headphones,
  PlusCircle,
  RefreshCw,
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

  const fullName = intervenant
    ? [intervenant.firstName, intervenant.lastName].filter(Boolean).join(" ") ||
      user?.name ||
      user?.email?.split("@")[0] ||
      "Intervenant"
    : user?.email?.split("@")[0] || "Intervenant";

  const getStatusInfo = (status?: string) => {
    switch (status) {
      case "approved":
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          label: "Approuvé",
          bgClass: "bg-emerald-100",
          textClass: "text-emerald-700",
          borderClass: "border-emerald-200",
        };
      case "rejected":
        return {
          icon: <XCircle className="w-5 h-5" />,
          label: "Rejeté",
          bgClass: "bg-red-100",
          textClass: "text-red-700",
          borderClass: "border-red-200",
        };
      default:
        return {
          icon: <Clock className="w-5 h-5" />,
          label: "En attente",
          bgClass: "bg-amber-100",
          textClass: "text-amber-700",
          borderClass: "border-amber-200",
        };
    }
  };

  const statusInfo = getStatusInfo(intervenant?.status);

  // Documents requis pour validation
  const REQUIRED_DOC_TYPES = ["CV", "DIPLOME", "PIECE_IDENTITE", "KBIS", "RIB", "ASSURANCE", "PROFILE_IMAGE"];

  // Vérifier les documents manquants
  const uploadedDocTypes = intervenant?.documents?.map((doc: any) => doc.type) || [];
  const missingDocs = REQUIRED_DOC_TYPES.filter(type => !uploadedDocTypes.includes(type));
  const hasIncompleteDocuments = missingDocs.length > 0;

  return (
    <div className="min-h-screen bg-[#ebf2fa]">
      <PageContainer maxWidth="7xl" className="py-8">
        {/* Header compact */}
        <div className="bg-white rounded-2xl border border-[#1c2942]/10 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative">
                {intervenant?.profileImage ? (
                  <img
                    src={intervenant.profileImage}
                    alt={fullName}
                    className="w-14 h-14 rounded-xl object-cover border-2 border-[#ebf2fa]"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-[#ebf2fa] flex items-center justify-center">
                    <User className="w-7 h-7 text-[#6d74b5]" />
                  </div>
                )}
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${statusInfo.bgClass} rounded-md flex items-center justify-center ${statusInfo.textClass} border-2 border-white`}>
                  {statusInfo.icon}
                </div>
              </div>

              <div>
                <h1 className="text-xl font-bold text-[#1c2942]">Bonjour, {fullName}</h1>
                <div className="flex items-center gap-2 text-sm text-[#1c2942]/60">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${statusInfo.bgClass} ${statusInfo.textClass} font-medium`}>
                {statusInfo.icon}
                {statusInfo.label}
              </div>
            </div>
          </div>

          {/* Stats inline */}
          <div className="flex flex-wrap items-center gap-6 mt-4 pt-4 border-t border-[#1c2942]/10">
            {[
              { icon: <Briefcase className="w-4 h-4" />, value: intervenant?.missions?.length || 0, label: "Missions" },
              { icon: <FileText className="w-4 h-4" />, value: intervenant?.documents?.length || 0, label: "Documents" },
              { icon: <Target className="w-4 h-4" />, value: intervenant?.status === "approved" ? "Actif" : "En attente", label: "Profil" },
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-[#6d74b5]">{stat.icon}</span>
                <span className="font-bold text-[#1c2942]">{stat.value}</span>
                <span className="text-sm text-[#1c2942]/60">{stat.label}</span>
              </div>
            ))}

            {/* Boutons d'action */}
            <div className="flex items-center gap-3 ml-auto">
              <Link to="/collaborations/nouvelle">
                <Button variant="primary" size="sm">
                  <PlusCircle className="w-4 h-4" />
                  Déclarer une mission
                </Button>
              </Link>
              <Link to="/dashboard/intervenant/disponibilites">
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4" />
                  M'actualiser
                </Button>
              </Link>
            </div>
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
                <div className="h-20 bg-[#ebf2fa] rounded"></div>
                <div className="h-16 bg-[#ebf2fa] rounded"></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-[#1c2942]/10 p-6 animate-pulse">
              <div className="h-6 bg-[#ebf2fa] rounded w-1/2 mb-6"></div>
              <div className="space-y-3">
                <div className="h-12 bg-[#ebf2fa] rounded-xl"></div>
                <div className="h-12 bg-[#ebf2fa] rounded-xl"></div>
                <div className="h-12 bg-[#ebf2fa] rounded-xl"></div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Pending status alert */}
            {intervenant?.status === "pending" && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-amber-900 mb-1">Profil en attente de validation</h3>
                    <p className="text-amber-700">
                      Votre compte est en cours de vérification par notre équipe. Vous serez notifié une fois votre profil approuvé.
                    </p>
                    {hasIncompleteDocuments && (
                      <div className="mt-4 p-3 bg-amber-100 rounded-xl">
                        <div className="flex items-center gap-2 text-amber-800 font-medium mb-2">
                          <AlertTriangle className="w-4 h-4" />
                          Documents incomplets ({missingDocs.length} manquant{missingDocs.length > 1 ? "s" : ""})
                        </div>
                        <p className="text-sm text-amber-700 mb-3">
                          Pour valider votre profil, veuillez téléverser tous les documents requis.
                        </p>
                        <Link to="/dashboard/intervenant/documents">
                          <Button variant="primary" size="sm">
                            <FileText className="w-4 h-4" />
                            Compléter mon dossier
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-[#1c2942]/10 shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#ebf2fa] rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-[#6d74b5]" />
                  </div>
                  <h2 className="text-xl font-bold text-[#1c2942]">Mon Profil</h2>
                </div>

                <div className="space-y-6">
                  {intervenant?.bio && (
                    <div className="bg-[#ebf2fa] rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-[#1c2942] mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#6d74b5]" />
                        Biographie
                      </h4>
                      <p className="text-[#1c2942]/70 leading-relaxed">{intervenant.bio}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {intervenant?.siret && (
                      <div className="bg-[#ebf2fa] rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-[#1c2942] mb-2 flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[#6d74b5]" />
                          SIRET
                        </h4>
                        <p className="text-[#1c2942] font-mono">{intervenant.siret}</p>
                      </div>
                    )}

                    <div className="bg-[#ebf2fa] rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-[#1c2942] mb-2 flex items-center gap-2">
                        <Award className="w-4 h-4 text-[#6d74b5]" />
                        Statut du profil
                      </h4>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${statusInfo.bgClass} ${statusInfo.textClass}`}>
                        {statusInfo.icon}
                        {statusInfo.label}
                      </span>
                      {hasIncompleteDocuments && intervenant?.status === "pending" && (
                        <div className="mt-3 flex items-start gap-2 text-amber-600">
                          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-medium">Documents incomplets</p>
                            <p className="text-xs text-amber-500">
                              {missingDocs.length} document{missingDocs.length > 1 ? "s" : ""} manquant{missingDocs.length > 1 ? "s" : ""} pour valider votre profil
                            </p>
                            <Link
                              to="/dashboard/intervenant/documents"
                              className="text-xs text-[#6d74b5] hover:text-[#1c2942] font-medium mt-1 inline-block"
                            >
                              Compléter mon dossier →
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Card */}
              <div className="bg-white rounded-2xl border border-[#1c2942]/10 shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#ebf2fa] rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[#6d74b5]" />
                  </div>
                  <h2 className="text-xl font-bold text-[#1c2942]">Actions rapides</h2>
                </div>

                <div className="space-y-3">
                  <Link to="/missions" className="block group">
                    <div className="flex items-center justify-between p-4 bg-[#ebf2fa] hover:bg-[#ebf2fa]/70 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#1c2942] rounded-lg flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-[#1c2942]">Voir les missions</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#6d74b5] group-hover:translate-x-1 transition-transform" />
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

                  <Link to="/dashboard/intervenant/profil" className="block group">
                    <div className="flex items-center justify-between p-4 bg-[#ebf2fa] hover:bg-[#ebf2fa]/70 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#6d74b5] rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-[#1c2942]">Mon profil public</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#6d74b5] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>

                  <Link to="/dashboard/intervenant/documents" className="block group">
                    <div className="flex items-center justify-between p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-[#1c2942]">Mon dossier</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>

                  <Link to="/dashboard/intervenant/declarations" className="block group">
                    <div className="flex items-center justify-between p-4 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                          <Calculator className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-[#1c2942]">Mes déclarations</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-amber-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>

                  <Link to="/dashboard/intervenant/factures" className="block group">
                    <div className="flex items-center justify-between p-4 bg-[#ebf2fa] hover:bg-[#ebf2fa]/70 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#6d74b5] rounded-lg flex items-center justify-center">
                          <Receipt className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-[#1c2942]">Mes factures</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#6d74b5] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>

                  <Link to="/dashboard/intervenant/disponibilites" className="block group">
                    <div className="flex items-center justify-between p-4 bg-[#ebf2fa] hover:bg-[#ebf2fa]/70 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#1c2942] rounded-lg flex items-center justify-center">
                          <CalendarClock className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-[#1c2942]">Mes disponibilités</span>
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
