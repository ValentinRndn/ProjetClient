import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { createMission } from "@/services/missions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Euro,
  FileText,
  CheckCircle,
  Users,
  Target,
  Lightbulb,
} from "lucide-react";
import { Link } from "react-router";

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
        priceCents: data.priceCents
          ? Math.round(parseFloat(data.priceCents) * 100)
          : undefined,
        status: "ACTIVE" as const,
      };

      await createMission(missionData);
      setSuccess(true);

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
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: "#ebf2fa" }}
      >
        <div
          className="rounded-xl shadow-lg p-10 text-center max-w-md w-full"
          style={{ backgroundColor: "#ffffff" }}
        >
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-5"
            style={{ backgroundColor: "#6d74b5" }}
          >
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2
            className="text-2xl font-bold mb-3"
            style={{ color: "#1c2942" }}
          >
            Mission créée avec succès !
          </h2>
          <p className="mb-6" style={{ color: "#6d74b5" }}>
            Votre mission est maintenant visible par les intervenants qualifiés.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm" style={{ color: "#6d74b5" }}>
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: "#6d74b5" }}
            />
            Redirection vers votre dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#ebf2fa", minHeight: "100vh" }}>
      {/* Header compact */}
      <div style={{ backgroundColor: "#1c2942", minHeight: "150px" }} className="flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
          <Link
            to="/mes-missions"
            className="inline-flex items-center gap-2 text-sm mb-3 transition-colors hover:opacity-80"
            style={{ color: "rgba(235, 242, 250, 0.7)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à mes missions
          </Link>

          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#6d74b5" }}
            >
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Proposer une mission
              </h1>
              <p className="text-sm" style={{ color: "rgba(235, 242, 250, 0.7)" }}>
                Décrivez votre besoin et trouvez l'expert idéal
              </p>
            </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulaire */}
          <div className="lg:col-span-2">
            <div
              className="rounded-xl shadow-sm p-6"
              style={{ backgroundColor: "#ffffff" }}
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Titre */}
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: "#1c2942" }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: "#ebf2fa" }}
                      >
                        <FileText className="w-4 h-4" style={{ color: "#6d74b5" }} />
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
                    className="h-11 rounded-lg"
                    style={{
                      borderColor: errors.title ? "#ef4444" : "#ebf2fa",
                      backgroundColor: "#ffffff",
                    }}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full" />
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: "#1c2942" }}
                  >
                    Description de la mission
                  </label>
                  <textarea
                    {...register("description")}
                    rows={4}
                    placeholder="Décrivez le contenu de l'intervention, le public cible, les objectifs pédagogiques..."
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition resize-none"
                    style={{
                      borderWidth: "1px",
                      borderColor: "#ebf2fa",
                      color: "#1c2942",
                      backgroundColor: "#ffffff",
                    }}
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: "#1c2942" }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: "#ebf2fa" }}
                        >
                          <Calendar className="w-4 h-4" style={{ color: "#6d74b5" }} />
                        </div>
                        Date de début
                      </div>
                    </label>
                    <Input
                      type="date"
                      {...register("startDate")}
                      className="h-11 rounded-lg"
                      style={{ borderColor: "#ebf2fa" }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: "#1c2942" }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: "#ebf2fa" }}
                        >
                          <Calendar className="w-4 h-4" style={{ color: "#6d74b5" }} />
                        </div>
                        Date de fin
                      </div>
                    </label>
                    <Input
                      type="date"
                      {...register("endDate")}
                      className="h-11 rounded-lg"
                      style={{ borderColor: "#ebf2fa" }}
                    />
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: "#1c2942" }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: "#ebf2fa" }}
                      >
                        <Euro className="w-4 h-4" style={{ color: "#6d74b5" }} />
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
                    className="h-11 rounded-lg"
                    style={{ borderColor: "#ebf2fa" }}
                  />
                  <p className="text-sm mt-1.5" style={{ color: "#6d74b5" }}>
                    Laissez vide si le budget est à négocier
                  </p>
                </div>

                {/* Actions */}
                <div
                  className="flex gap-4 pt-5"
                  style={{ borderTopWidth: "1px", borderColor: "#ebf2fa" }}
                >
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate(-1)}
                    className="flex-1 h-11 rounded-lg"
                    style={{
                      backgroundColor: "#ebf2fa",
                      color: "#1c2942",
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    className="flex-1 h-11 rounded-lg"
                    style={{
                      backgroundColor: "#6d74b5",
                      color: "#ffffff",
                    }}
                  >
                    <Briefcase className="w-4 h-4" />
                    Publier la mission
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Conseils */}
            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: "#ffffff" }}
            >
              <h3
                className="font-semibold mb-4 flex items-center gap-2"
                style={{ color: "#1c2942" }}
              >
                <Lightbulb className="w-5 h-5" style={{ color: "#6d74b5" }} />
                Conseils pour une bonne mission
              </h3>
              <ul className="space-y-3 text-sm" style={{ color: "#1c2942" }}>
                {[
                  "Soyez précis dans votre description",
                  "Indiquez le niveau des étudiants",
                  "Mentionnez les compétences recherchées",
                  "Précisez les objectifs pédagogiques",
                ].map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle
                      className="w-4 h-4 mt-0.5 flex-shrink-0"
                      style={{ color: "#6d74b5" }}
                    />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Stats */}
            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: "#ffffff" }}
            >
              <h3
                className="font-semibold mb-4"
                style={{ color: "#1c2942" }}
              >
                Notre réseau
              </h3>
              <div className="space-y-4">
                {[
                  {
                    icon: <Users className="w-5 h-5" style={{ color: "#6d74b5" }} />,
                    value: "500+",
                    label: "Intervenants",
                  },
                  {
                    icon: <Target className="w-5 h-5" style={{ color: "#6d74b5" }} />,
                    value: "98%",
                    label: "Satisfaction",
                  },
                  {
                    icon: <Briefcase className="w-5 h-5" style={{ color: "#6d74b5" }} />,
                    value: "1000+",
                    label: "Missions réalisées",
                  },
                ].map((stat, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: "#ebf2fa" }}
                    >
                      {stat.icon}
                    </div>
                    <div>
                      <p className="font-bold" style={{ color: "#1c2942" }}>
                        {stat.value}
                      </p>
                      <p className="text-sm" style={{ color: "#6d74b5" }}>
                        {stat.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
