import { useForm, FormProvider } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { loginFormFields } from "@/config/loginFormConfig";
import { useState } from "react";
import { FormField } from "@/components/shared/FormField";
import { motion } from "motion/react";
import { LogIn, ArrowLeft, Shield, Sparkles } from "lucide-react";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export function LoginForm() {
  const methods = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const { handleSubmit, register } = methods;
  const { login, error, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    setLocalError(null);

    try {
      await login(data.email, data.password);
    } catch (err: unknown) {
      const errorObj = err as { message?: string; status?: number };
      setLocalError(errorObj?.message || "Identifiants invalides");
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-mesh relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white">
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

            <h1 className="text-4xl xl:text-5xl font-extrabold mb-6 leading-tight">
              Connectez-vous à votre{" "}
              <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                espace personnel
              </span>
            </h1>

            <p className="text-lg text-indigo-100/80 mb-10 max-w-md">
              Accédez à vos missions, gérez votre profil et connectez-vous avec
              les meilleures écoles et intervenants.
            </p>

            <div className="space-y-4">
              {[
                { icon: <Shield className="w-5 h-5" />, text: "Connexion sécurisée" },
                { icon: <Sparkles className="w-5 h-5" />, text: "Accès instantané au dashboard" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-indigo-100">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3">
              <img src="/logo.svg" alt="Vizion Academy" className="w-10 h-10" />
              <div className="text-left">
                <span className="text-xl font-bold text-gray-900 block">Vizion</span>
                <span className="text-xs text-indigo-600">Academy</span>
              </div>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              Bienvenue !
            </h2>
            <p className="text-gray-600">
              Connectez-vous pour accéder à votre espace
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

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-5">
                  {loginFormFields.map((field) => (
                    <FormField key={field.name} field={field} />
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      {...register("rememberMe")}
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span className="ml-2 text-gray-600 group-hover:text-gray-900 transition-colors">
                      Se souvenir de moi
                    </span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  isLoading={isLoading}
                  fullWidth
                >
                  <LogIn className="w-4 h-4" />
                  Se connecter
                </Button>
              </form>
            </FormProvider>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-600">
                Pas encore de compte ?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Créer un compte
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Retour à l'accueil
            </Link>
          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            En vous connectant, vous acceptez nos{" "}
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
