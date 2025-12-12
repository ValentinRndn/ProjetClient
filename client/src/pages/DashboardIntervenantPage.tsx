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
} from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { Link } from "react-router";
import { motion } from "motion/react";

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

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4" />
            Approuvé
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-4 h-4" />
            En attente de validation
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <XCircle className="w-4 h-4" />
            Rejeté
          </span>
        );
      default:
        return null;
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
          color: "emerald",
          bgClass: "bg-emerald-100",
          textClass: "text-emerald-700",
          borderClass: "border-emerald-200",
        };
      case "rejected":
        return {
          icon: <XCircle className="w-5 h-5" />,
          label: "Rejeté",
          color: "red",
          bgClass: "bg-red-100",
          textClass: "text-red-700",
          borderClass: "border-red-200",
        };
      default:
        return {
          icon: <Clock className="w-5 h-5" />,
          label: "En attente",
          color: "amber",
          bgClass: "bg-amber-100",
          textClass: "text-amber-700",
          borderClass: "border-amber-200",
        };
    }
  };

  const statusInfo = getStatusInfo(intervenant?.status);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-mesh overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        <PageContainer maxWidth="7xl" className="relative z-10 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-6">
                {/* Avatar */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative"
                >
                  {intervenant?.profileImage ? (
                    <img
                      src={intervenant.profileImage}
                      alt={fullName}
                      className="w-24 h-24 rounded-2xl object-cover border-4 border-white/20 shadow-xl"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <User className="w-12 h-12 text-white" />
                    </div>
                  )}
                  <div className={`absolute -bottom-2 -right-2 w-8 h-8 ${statusInfo.bgClass} rounded-lg flex items-center justify-center ${statusInfo.textClass} border-2 border-white shadow-lg`}>
                    {statusInfo.icon}
                  </div>
                </motion.div>

                <div className="text-white">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-3">
                    <Award className="w-4 h-4 text-amber-300" />
                    <span className="text-sm font-medium">Espace Intervenant</span>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
                    Bonjour,{" "}
                    <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                      {fullName}
                    </span>
                  </h1>

                  <div className="flex items-center gap-2 text-indigo-200">
                    <Mail className="w-4 h-4" />
                    <span>{user?.email}</span>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl ${statusInfo.bgClass} ${statusInfo.textClass} border ${statusInfo.borderClass} font-semibold shadow-lg`}
              >
                {statusInfo.icon}
                Statut: {statusInfo.label}
              </motion.div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mt-10">
              {[
                { icon: <Briefcase className="w-5 h-5" />, value: intervenant?.missions?.length || 0, label: "Missions" },
                { icon: <FileText className="w-5 h-5" />, value: intervenant?.documents?.length || 0, label: "Documents" },
                { icon: <Target className="w-5 h-5" />, value: intervenant?.status === "approved" ? "Actif" : "En attente", label: "Profil" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + idx * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 min-w-[100px]"
                >
                  <div className="flex items-center gap-2 text-amber-300 mb-1">
                    {stat.icon}
                    <span className="text-2xl font-bold">{stat.value}</span>
                  </div>
                  <span className="text-sm text-indigo-100/70">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </PageContainer>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent" />
      </div>

      <PageContainer maxWidth="7xl" className="py-8 -mt-8 relative z-20">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert type="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </motion.div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="space-y-3">
                <div className="h-12 bg-gray-200 rounded-xl"></div>
                <div className="h-12 bg-gray-200 rounded-xl"></div>
                <div className="h-12 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Pending status alert */}
            {intervenant?.status === "pending" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-900 mb-1">Profil en attente de validation</h3>
                    <p className="text-amber-700">
                      Votre compte est en cours de vérification par notre équipe. Vous serez notifié une fois votre profil approuvé.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-xl p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Mon Profil</h2>
                </div>

                <div className="space-y-6">
                  {intervenant?.bio && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-500" />
                        Biographie
                      </h4>
                      <p className="text-gray-600 leading-relaxed">{intervenant.bio}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {intervenant?.siret && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-indigo-500" />
                          SIRET
                        </h4>
                        <p className="text-gray-900 font-mono">{intervenant.siret}</p>
                      </div>
                    )}

                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Award className="w-4 h-4 text-indigo-500" />
                        Statut du profil
                      </h4>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${statusInfo.bgClass} ${statusInfo.textClass}`}>
                        {statusInfo.icon}
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Actions Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-xl p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Actions rapides</h2>
                </div>

                <div className="space-y-3">
                  <Link to="/missions" className="block group">
                    <div className="flex items-center justify-between p-4 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-gray-900">Voir les missions</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-indigo-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>

                  <Link to="/dashboard/intervenant/profil" className="block group">
                    <div className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-gray-900">Mon profil public</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>

                  <Link to="/dashboard/intervenant/documents" className="block group">
                    <div className="flex items-center justify-between p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-gray-900">Mon dossier</span>
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
                        <span className="font-semibold text-gray-900">Mes déclarations</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-amber-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6"
            >
              {[
                {
                  label: "Missions acceptées",
                  value: intervenant?.missions?.length || 0,
                  icon: <CheckCircle className="w-6 h-6" />,
                  bgColor: "bg-emerald-100",
                  textColor: "text-emerald-600",
                },
                {
                  label: "Documents uploadés",
                  value: intervenant?.documents?.length || 0,
                  icon: <FileText className="w-6 h-6" />,
                  bgColor: "bg-blue-100",
                  textColor: "text-blue-600",
                },
                {
                  label: "Profil complété",
                  value: intervenant?.bio ? "100%" : "50%",
                  icon: <User className="w-6 h-6" />,
                  bgColor: "bg-indigo-100",
                  textColor: "text-indigo-600",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="group relative bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:border-indigo-100 transition-all duration-300"
                >
                  {/* Decorative gradient on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-50/0 to-purple-50/0 group-hover:from-indigo-50/50 group-hover:to-purple-50/30 transition-all duration-300 pointer-events-none" />

                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">{stat.label}</p>
                      <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                    </div>
                    <div className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center ${stat.textColor} group-hover:scale-110 transition-transform`}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </>
        )}
      </PageContainer>
    </div>
  );
}
