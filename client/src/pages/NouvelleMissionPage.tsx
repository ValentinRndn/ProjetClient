import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { createMission } from "@/services/missions";
import { PageContainer } from "@/components/ui/PageContainer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { ArrowLeft, Briefcase, Calendar, Euro, FileText, Sparkles, CheckCircle, Users, Target } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";

interface MissionFormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  priceCents: string;
}

export default function NouvelleMissionPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MissionFormData>();

  const onSubmit = async (data: MissionFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const missionData = {
        title: data.title,
        description: data.description || undefined,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
        priceCents: data.priceCents ? Math.round(parseFloat(data.priceCents) * 100) : undefined,
        status: "ACTIVE" as const,
      };

      await createMission(missionData);
      setSuccess(true);

      // Rediriger vers le dashboard école après 2 secondes
      setTimeout(() => {
        navigate("/dashboard/ecole");
      }, 2000);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors de la création de la mission";
      setError(errorMessage);
      console.error("Error creating mission:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-12 text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Mission créée avec succès !
          </h2>
          <p className="text-gray-600 mb-8">
            Votre mission est maintenant visible par les intervenants qualifiés.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            Redirection vers votre dashboard...
          </div>
        </motion.div>
      </div>
    );
  }

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

        <PageContainer maxWidth="5xl" className="relative z-10 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <Link
              to="/mes-missions"
              className="inline-flex items-center gap-2 text-indigo-200 hover:text-white transition-colors mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Retour à mes missions
            </Link>

            <div className="flex items-center gap-2 mb-4">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span className="text-sm font-medium">Nouvelle mission</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Proposer une{" "}
              <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                Mission
              </span>
            </h1>

            <p className="text-lg text-indigo-100/80 max-w-2xl">
              Décrivez votre besoin d'intervention et trouvez l'expert idéal parmi notre réseau d'intervenants qualifiés.
            </p>
          </motion.div>
        </PageContainer>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent" />
      </div>

      <PageContainer maxWidth="5xl" className="py-8 -mt-8 relative z-20">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Titre */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-indigo-600" />
                      </div>
                      Titre de la mission *
                    </div>
                  </label>
                  <Input
                    {...register("title", {
                      required: "Le titre est obligatoire",
                      minLength: {
                        value: 5,
                        message: "Le titre doit faire au moins 5 caractères",
                      },
                    })}
                    placeholder="Ex: Intervention sur l'Intelligence Artificielle"
                    className={`h-12 rounded-xl ${errors.title ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"}`}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full" />
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Description de la mission
                  </label>
                  <textarea
                    {...register("description")}
                    rows={5}
                    placeholder="Décrivez le contenu de l'intervention, le public cible, les objectifs pédagogiques..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition resize-none text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-indigo-600" />
                        </div>
                        Date de début
                      </div>
                    </label>
                    <Input
                      type="date"
                      {...register("startDate")}
                      className="h-12 rounded-xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-indigo-600" />
                        </div>
                        Date de fin
                      </div>
                    </label>
                    <Input
                      type="date"
                      {...register("endDate")}
                      className="h-12 rounded-xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                    />
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Euro className="w-4 h-4 text-amber-600" />
                      </div>
                      Budget (en euros)
                    </div>
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("priceCents")}
                    placeholder="Ex: 500"
                    className="h-12 rounded-xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                  />
                  <p className="text-gray-500 text-sm mt-2">
                    Laissez vide si le budget est à négocier
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-6 border-t border-gray-100">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate(-1)}
                    className="flex-1 h-12 rounded-xl"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    className="flex-1 h-12 rounded-xl"
                  >
                    <Briefcase className="w-4 h-4" />
                    Publier la mission
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Tips card */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                Conseils pour une bonne mission
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                {[
                  "Soyez précis dans votre description",
                  "Indiquez le niveau des étudiants",
                  "Mentionnez les compétences recherchées",
                  "Précisez les objectifs pédagogiques",
                ].map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Stats card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Notre réseau</h3>
              <div className="space-y-4">
                {[
                  { icon: <Users className="w-5 h-5 text-indigo-600" />, value: "500+", label: "Intervenants" },
                  { icon: <Target className="w-5 h-5 text-emerald-600" />, value: "98%", label: "Satisfaction" },
                  { icon: <Briefcase className="w-5 h-5 text-amber-600" />, value: "1000+", label: "Missions réalisées" },
                ].map((stat, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </PageContainer>
    </div>
  );
}
