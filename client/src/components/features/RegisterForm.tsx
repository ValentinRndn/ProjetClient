import { useForm, FormProvider } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { registerFormFields } from "@/config/registerFormConfig";
import type { RegisterData } from "@/services/auth";
import { useState } from "react";
import { FormField } from "@/components/shared/FormField";
import { FileUpload } from "@/components/ui/FileUpload";
import { uploadDocument } from "@/services/intervenants";
import { getCurrentUser } from "@/services/auth";
import { UserPlus, ArrowLeft, CheckCircle, Shield } from "lucide-react";

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

  const { handleSubmit } = methods;

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const onSubmit = async (data: RegisterFormData) => {
    setLocalError(null);

    // Forcer le rôle INTERVENANT
    const registrationData: RegisterData = {
      email: data.email,
      password: data.password,
      role: "INTERVENANT",
    };

    // Données intervenant
    if (data.intervenantData) {
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

      await new Promise((resolve) => setTimeout(resolve, 500));

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

  const benefits = [
    "Accès à un réseau d'experts qualifiés",
    "Processus simplifié de mise en relation",
    "Gestion administrative facilitée",
    "Support dédié tout au long de vos projets",
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-2/5 bg-[#1c2942] relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop')`,
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-[#1c2942]/80" />

        <div className="relative z-10 flex flex-col justify-center px-10 xl:px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <img
              src="/logo.svg"
              alt="Vizion Academy"
              className="h-12 w-auto"
            />
          </div>

          <h1 className="text-3xl xl:text-4xl font-extrabold mb-6 leading-tight">
            Rejoignez notre{" "}
            <span className="text-[#ebf2fa]">communauté</span>
          </h1>

          <p className="text-base text-white/70 mb-8 max-w-sm">
            Créez votre compte et connectez-vous avec les meilleures écoles
            et intervenants du marché.
          </p>

          <div className="space-y-3">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#6d74b5]/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-white/80">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#6d74b5]/30 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-white/80">Inscription 100% gratuite</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-3/5 flex items-center justify-center p-6 sm:p-8 bg-[#ebf2fa] overflow-y-auto">
        <div className="w-full max-w-xl py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-3">
              <img
                src="/logo.svg"
                alt="Vizion Academy"
                className="h-10 w-auto"
              />
            </Link>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1c2942] mb-2">
              Créer un compte
            </h2>
            <p className="text-[#1c2942]/60">
              Rejoignez Vizion Academy et commencez dès aujourd'hui
            </p>
          </div>

          {displayError && (
            <div className="mb-6">
              <Alert type="error" onClose={() => setLocalError(null)}>
                {displayError}
              </Alert>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg border border-[#1c2942]/10 p-6 sm:p-8">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Info: inscription intervenant uniquement */}
                <div className="bg-[#ebf2fa] border border-[#6d74b5]/20 rounded-xl p-4">
                  <p className="text-sm text-[#1c2942]">
                    <strong>Inscription Intervenant</strong> - Les comptes école sont créés par l'administration.
                    Contactez-nous si vous êtes une école.
                  </p>
                </div>

                {/* Role caché - toujours INTERVENANT */}
                <input type="hidden" value="INTERVENANT" {...methods.register("role")} />

                {/* Informations de base */}
                <div className="space-y-5 pt-6 border-t border-[#1c2942]/10">
                  <h3 className="text-sm font-semibold text-[#1c2942] uppercase tracking-wider">
                    Informations de connexion
                  </h3>
                  {registerFormFields
                    .filter((field) => field.group === "base")
                    .map((field) => (
                      <FormField key={field.name} field={field} />
                    ))}
                </div>

                {/* Champs intervenant */}
                <div className="space-y-5 pt-6 border-t border-[#1c2942]/10">
                  <h3 className="text-sm font-semibold text-[#1c2942] uppercase tracking-wider">
                    Informations personnelles
                  </h3>
                  {registerFormFields
                    .filter((field) => field.group === "intervenant")
                    .map((field) => (
                      <FormField key={field.name} field={field} />
                    ))}

                  {/* Champs d'upload pour les intervenants */}
                  <div className="space-y-4 pt-4">
                    <h4 className="text-sm font-medium text-[#1c2942]/70">
                      Documents (optionnel)
                    </h4>
                    <FileUpload
                      label="Photo de profil"
                      accept="image/*"
                      maxSizeMB={5}
                      value={profileImage}
                      onChange={setProfileImage}
                      helperText="JPG, PNG. Max 5MB"
                    />
                    <FileUpload
                      label="CV"
                      accept=".pdf,.doc,.docx"
                      maxSizeMB={10}
                      value={cvFile}
                      onChange={setCvFile}
                      helperText="PDF, DOC, DOCX. Max 10MB"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  fullWidth
                >
                  <UserPlus className="w-4 h-4" />
                  Créer mon compte
                </Button>
              </form>
            </FormProvider>

            <div className="mt-6 pt-6 border-t border-[#1c2942]/10 text-center">
              <p className="text-sm text-[#1c2942]/60">
                Vous avez déjà un compte ?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-[#6d74b5] hover:text-[#1c2942] transition-colors"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-[#1c2942]/50 hover:text-[#1c2942] transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Retour à l'accueil
            </Link>
          </div>

          <p className="mt-6 text-center text-xs text-[#1c2942]/40">
            En créant un compte, vous acceptez nos{" "}
            <Link to="/cgu" className="text-[#6d74b5] hover:underline">
              CGU
            </Link>{" "}
            et notre{" "}
            <Link
              to="/politique-confidentialite"
              className="text-[#6d74b5] hover:underline"
            >
              politique de confidentialité
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
