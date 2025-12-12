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
import { motion } from "motion/react";
import { UserPlus, ArrowLeft, CheckCircle, Users, Building2 } from "lucide-react";

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
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-mesh relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-10 xl:px-16 text-white">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <img src="/logo.svg" alt="Vizion Academy" className="w-12 h-12" />
              <div>
                <span className="text-2xl font-bold block">Vizion</span>
                <span className="text-sm text-indigo-300">Academy</span>
              </div>
            </div>

            <h1 className="text-3xl xl:text-4xl font-extrabold mb-6 leading-tight">
              Rejoignez notre{" "}
              <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                communauté
              </span>
            </h1>

            <p className="text-base text-indigo-100/80 mb-8 max-w-sm">
              Créez votre compte et connectez-vous avec les meilleures écoles
              et intervenants du marché.
            </p>

            <div className="space-y-3">
              {benefits.map((benefit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + idx * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-sm text-indigo-100/90">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-bold">35+</div>
                  <div className="text-xs text-indigo-200">Écoles</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-bold">150+</div>
                  <div className="text-xs text-indigo-200">Intervenants</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-3/5 flex items-center justify-center p-6 sm:p-8 bg-gray-50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl py-8"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-3">
              <img src="/logo.svg" alt="Vizion Academy" className="w-10 h-10" />
              <div className="text-left">
                <span className="text-xl font-bold text-gray-900 block">Vizion</span>
                <span className="text-xs text-indigo-600">Academy</span>
              </div>
            </Link>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
              Créer un compte
            </h2>
            <p className="text-gray-600">
              Rejoignez Vizion Academy et commencez dès aujourd'hui
            </p>
          </div>

          {displayError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Alert type="error" onClose={() => setLocalError(null)}>
                {displayError}
              </Alert>
            </motion.div>
          )}

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Info: inscription intervenant uniquement */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                  <p className="text-sm text-indigo-700">
                    <strong>Inscription Intervenant</strong> - Les comptes école sont créés par l'administration.
                    Contactez-nous si vous êtes une école.
                  </p>
                </div>

                {/* Role caché - toujours INTERVENANT */}
                <input type="hidden" value="INTERVENANT" {...methods.register("role")} />

                {/* Informations de base */}
                <div className="space-y-5 pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    Informations de connexion
                  </h3>
                  {registerFormFields
                    .filter((field) => field.group === "base")
                    .map((field) => (
                      <FormField key={field.name} field={field} />
                    ))}
                </div>

                {/* Champs intervenant */}
                <div className="space-y-5 pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    Informations personnelles
                  </h3>
                  {registerFormFields
                    .filter((field) => field.group === "intervenant")
                    .map((field) => (
                      <FormField key={field.name} field={field} />
                    ))}

                  {/* Champs d'upload pour les intervenants */}
                  <div className="space-y-4 pt-4">
                    <h4 className="text-sm font-medium text-gray-700">
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
                  variant="gradient"
                  size="lg"
                  isLoading={isLoading}
                  fullWidth
                >
                  <UserPlus className="w-4 h-4" />
                  Créer mon compte
                </Button>
              </form>
            </FormProvider>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-600">
                Vous avez déjà un compte ?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Retour à l'accueil
            </Link>
          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            En créant un compte, vous acceptez nos{" "}
            <a href="#" className="text-indigo-600 hover:underline">
              CGU
            </a>{" "}
            et notre{" "}
            <a href="#" className="text-indigo-600 hover:underline">
              politique de confidentialité
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
