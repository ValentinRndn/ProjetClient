import { useForm, FormProvider } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { RoleSelector } from "@/components/ui/RoleSelector";
import { FormCard } from "@/components/ui/FormCard";
import { PageContainer } from "@/components/ui/PageContainer";
import { LogoIcon } from "@/components/ui/LogoIcon";
import { registerFormFields } from "@/config/registerFormConfig";
import type { RegisterData } from "@/services/auth";
import { useState } from "react";
import { FormField } from "@/components/shared/FormField";
import { FileUpload } from "@/components/ui/FileUpload";
import { uploadDocument } from "@/services/intervenants";
import { getCurrentUser } from "@/services/auth";

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  role: "ECOLE" | "INTERVENANT";
  ecoleData?: {
    name?: string;
    contactEmail?: string;
    address?: string;
    phone?: string;
  };
  intervenantData?: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    siret?: string;
  };
}

export function RegisterForm() {
  const { register: registerUser, error, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [localError, setLocalError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const methods = useForm<RegisterFormData>({
    defaultValues: {
      role: "INTERVENANT",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { handleSubmit, watch, setValue } = methods;
  const role = watch("role");

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const onSubmit = async (data: RegisterFormData) => {
    setLocalError(null);

    const registrationData: RegisterData = {
      email: data.email,
      password: data.password,
      role: data.role,
    };

    if (data.role === "ECOLE" && data.ecoleData) {
      registrationData.ecoleData = {
        name: data.ecoleData.name || "",
        contactEmail: data.ecoleData.contactEmail || undefined,
        address: data.ecoleData.address || undefined,
        phone: data.ecoleData.phone || undefined,
      };
    } else if (data.role === "INTERVENANT" && data.intervenantData) {
      const name =
        [data.intervenantData.firstName, data.intervenantData.lastName]
          .filter(Boolean)
          .join(" ") || undefined;

      registrationData.intervenantData = {
        name: name,
        bio: data.intervenantData.bio || undefined,
        siret: data.intervenantData.siret || undefined,
      };
    }

    try {
      await registerUser(registrationData);

      // Attendre un peu pour que l'utilisateur soit bien créé côté serveur
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Si c'est un intervenant et qu'il y a des fichiers à uploader
      if (data.role === "INTERVENANT" && (profileImage || cvFile)) {
        try {
          // Récupérer l'utilisateur pour obtenir l'ID de l'intervenant
          const currentUser = await getCurrentUser();
          const intervenantId = currentUser.intervenant?.id;

          if (intervenantId) {
            // Upload de l'image de profil
            if (profileImage) {
              try {
                await uploadDocument(
                  intervenantId,
                  profileImage,
                  "PROFILE_IMAGE"
                );
              } catch (err) {
                console.error("Erreur lors de l'upload de l'image:", err);
                // Ne pas bloquer l'inscription si l'upload d'image échoue
              }
            }

            // Upload du CV
            if (cvFile) {
              try {
                await uploadDocument(intervenantId, cvFile, "CV");
              } catch (err) {
                console.error("Erreur lors de l'upload du CV:", err);
                // Ne pas bloquer l'inscription si l'upload de CV échoue
              }
            }
          }
        } catch (err) {
          console.error(
            "Erreur lors de la récupération de l'utilisateur:",
            err
          );
          // Ne pas bloquer l'inscription si la récupération échoue
        }
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string; status?: number };
      setLocalError(errorObj?.message || "Erreur lors de l'inscription");
    }
  };

  const handleRoleChange = (newRole: "ECOLE" | "INTERVENANT") => {
    setValue("role", newRole);
  };

  const displayError = localError || error;

  const footer = (
    <div className="text-center">
      <p className="text-sm text-gray-600">
        Vous avez déjà un compte ?{" "}
        <Link
          to="/login"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );

  return (
    <PageContainer
      className="bg-linear-to-br from-gray-50 to-gray-100"
      maxWidth="lg"
    >
      <FormCard
        title="Créer un compte"
        subtitle="Rejoignez Vizion Academy et commencez dès aujourd'hui"
        icon={<LogoIcon size="md" />}
        footer={footer}
      >
        {displayError && (
          <div className="mb-6">
            <Alert type="error" onClose={() => setLocalError(null)}>
              {displayError}
            </Alert>
          </div>
        )}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Sélection du type de compte */}
            <RoleSelector
              value={role || "INTERVENANT"}
              onChange={handleRoleChange}
              disabled={isLoading}
            />

            {/* Informations de base */}
            <div className="space-y-5 pt-6 border-t border-gray-200">
              {registerFormFields
                .filter((field) => field.group === "base")
                .map((field) => (
                  <FormField key={field.name} field={field} />
                ))}
            </div>

            {/* Champs conditionnels selon le rôle */}
            {(role === "ECOLE" || role === "INTERVENANT") && (
              <div className="space-y-5">
                {registerFormFields
                  .filter(
                    (field) =>
                      field.group ===
                      (role === "ECOLE" ? "ecole" : "intervenant")
                  )
                  .map((field) => (
                    <FormField key={field.name} field={field} />
                  ))}

                {/* Champs d'upload pour les intervenants */}
                {role === "INTERVENANT" && (
                  <>
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
                  </>
                )}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              Créer mon compte
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
