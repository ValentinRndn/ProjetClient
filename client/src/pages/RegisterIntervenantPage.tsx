import { useForm, FormProvider } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { FormCard } from "@/components/ui/FormCard";
import { PageContainer } from "@/components/ui/PageContainer";
import { LogoIcon } from "@/components/ui/LogoIcon";
import { registerFormFields } from "@/config/registerFormConfig";
import type { RegisterData } from "@/services/auth";
import { FormField } from "@/components/shared/FormField";
import { FileUpload } from "@/components/ui/FileUpload";
import { uploadDocument } from "@/services/intervenants";
import { getCurrentUser } from "@/services/auth";
import { UserCheck, CheckCircle } from "lucide-react";

interface RegisterIntervenantFormData {
  email: string;
  password: string;
  confirmPassword: string;
  intervenantData: {
    firstName: string;
    lastName: string;
    bio?: string;
    siret?: string;
  };
}

export default function RegisterIntervenantPage() {
  const { register: registerUser, error, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [localError, setLocalError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const methods = useForm<RegisterIntervenantFormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      intervenantData: {
        firstName: "",
        lastName: "",
        bio: "",
        siret: "",
      },
    },
  });

  const { handleSubmit } = methods;

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const onSubmit = async (data: RegisterIntervenantFormData) => {
    setLocalError(null);

    const name =
      [data.intervenantData.firstName, data.intervenantData.lastName]
        .filter(Boolean)
        .join(" ") || undefined;

    const registrationData: RegisterData = {
      email: data.email,
      password: data.password,
      role: "INTERVENANT",
      intervenantData: {
        name: name,
        bio: data.intervenantData.bio || undefined,
        siret: data.intervenantData.siret || undefined,
      },
    };

    try {
      await registerUser(registrationData);

      // Attendre un peu pour que l'utilisateur soit bien créé côté serveur
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Upload des fichiers si présents
      if (profileImage || cvFile) {
        try {
          const currentUser = await getCurrentUser();
          const intervenantId = currentUser.intervenant?.id;

          if (intervenantId) {
            if (profileImage) {
              try {
                await uploadDocument(intervenantId, profileImage, "PROFILE_IMAGE");
              } catch (err) {
                console.error("Erreur lors de l'upload de l'image:", err);
              }
            }

            if (cvFile) {
              try {
                await uploadDocument(intervenantId, cvFile, "CV");
              } catch (err) {
                console.error("Erreur lors de l'upload du CV:", err);
              }
            }
          }
        } catch (err) {
          console.error("Erreur lors de la récupération de l'utilisateur:", err);
        }
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string; status?: number };
      setLocalError(errorObj?.message || "Erreur lors de l'inscription");
    }
  };

  const displayError = localError || error;

  const footer = (
    <div className="text-center space-y-3">
      <p className="text-sm text-gray-600">
        Vous avez déjà un compte ?{" "}
        <Link
          to="/login"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Se connecter
        </Link>
      </p>
      <p className="text-sm text-gray-600">
        Vous êtes une école ?{" "}
        <Link
          to="/register"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Créer un compte école
        </Link>
      </p>
    </div>
  );

  const advantages = [
    "Accès aux missions des écoles partenaires",
    "Gestion simplifiée de votre facturation",
    "Visibilité auprès des établissements",
  ];

  return (
    <PageContainer
      className="bg-linear-to-br from-gray-50 to-gray-100"
      maxWidth="lg"
    >
      <FormCard
        title="Devenir Intervenant"
        subtitle="Rejoignez notre communauté d'experts et partagez votre savoir"
        icon={
          <div className="w-16 h-16 bg-gradient-to-br from-[#272757] to-[#505081] rounded-2xl flex items-center justify-center">
            <UserCheck className="w-8 h-8 text-white" />
          </div>
        }
        footer={footer}
      >
        {/* Avantages */}
        <div className="bg-indigo-50 rounded-xl p-4 mb-6">
          <p className="text-sm font-medium text-indigo-900 mb-2">
            En devenant intervenant, vous bénéficiez de :
          </p>
          <ul className="space-y-1">
            {advantages.map((advantage, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-indigo-700">
                <CheckCircle className="w-4 h-4 text-indigo-500" />
                {advantage}
              </li>
            ))}
          </ul>
        </div>

        {displayError && (
          <div className="mb-6">
            <Alert type="error" onClose={() => setLocalError(null)}>
              {displayError}
            </Alert>
          </div>
        )}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Informations personnelles */}
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Informations personnelles
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {registerFormFields
                  .filter(
                    (field) =>
                      field.group === "intervenant" &&
                      (field.name === "intervenantData.firstName" ||
                        field.name === "intervenantData.lastName")
                  )
                  .map((field) => (
                    <FormField key={field.name} field={field} />
                  ))}
              </div>
            </div>

            {/* Informations de connexion */}
            <div className="space-y-5 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Identifiants de connexion
              </h3>
              {registerFormFields
                .filter((field) => field.group === "base")
                .map((field) => (
                  <FormField key={field.name} field={field} />
                ))}
            </div>

            {/* Informations professionnelles */}
            <div className="space-y-5 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Informations professionnelles
              </h3>
              {registerFormFields
                .filter(
                  (field) =>
                    field.group === "intervenant" &&
                    field.name !== "intervenantData.firstName" &&
                    field.name !== "intervenantData.lastName"
                )
                .map((field) => (
                  <FormField key={field.name} field={field} />
                ))}

              {/* Upload fichiers */}
              <FileUpload
                label="Photo de profil (optionnel)"
                accept="image/*"
                maxSizeMB={5}
                value={profileImage}
                onChange={setProfileImage}
                helperText="Formats acceptés: JPG, PNG. Taille max: 5MB"
              />
              <FileUpload
                label="CV (optionnel)"
                accept=".pdf,.doc,.docx"
                maxSizeMB={10}
                value={cvFile}
                onChange={setCvFile}
                helperText="Formats acceptés: PDF, DOC, DOCX. Taille max: 10MB"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              <UserCheck className="w-5 h-5" />
              Créer mon compte intervenant
            </Button>
          </form>
        </FormProvider>
      </FormCard>

      <div className="mt-6 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Retour à l'accueil
        </Link>
      </div>
    </PageContainer>
  );
}
