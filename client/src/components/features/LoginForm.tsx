import { useForm, FormProvider } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { loginFormFields } from "@/config/loginFormConfig";
import { useState } from "react";
import { FormField } from "@/components/shared/FormField";
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
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1c2942] relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop')`,
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-[#1c2942]/80" />

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white">
          <div className="flex items-center gap-3 mb-8">
            <img
              src="/logo.svg"
              alt="Vizion Academy"
              className="h-12 w-auto"
            />
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold mb-6 leading-tight">
            Connectez-vous à votre{" "}
            <span className="text-[#ebf2fa]">espace personnel</span>
          </h1>

          <p className="text-lg text-white/70 mb-10 max-w-md">
            Accédez à vos missions, gérez votre profil et connectez-vous avec
            les meilleures écoles et intervenants.
          </p>

          <div className="space-y-4">
            {[
              {
                icon: <Shield className="w-5 h-5" />,
                text: "Connexion sécurisée",
              },
              {
                icon: <Sparkles className="w-5 h-5" />,
                text: "Accès instantané au dashboard",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#6d74b5]/30 rounded-xl flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="text-white/80">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-[#ebf2fa]">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3">
              <img
                src="/logo.svg"
                alt="Vizion Academy"
                className="h-10 w-auto"
              />
            </Link>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-[#1c2942] mb-2">
              Bienvenue !
            </h2>
            <p className="text-[#1c2942]/60">
              Connectez-vous pour accéder à votre espace
            </p>
          </div>

          {displayError && (
            <div className="mb-6">
              <Alert type="error" onClose={() => setLocalError(null)}>
                {displayError}
              </Alert>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg border border-[#1c2942]/10 p-8">
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
                      className="w-4 h-4 rounded border-[#1c2942]/30 text-[#6d74b5] focus:ring-[#6d74b5] cursor-pointer"
                    />
                    <span className="ml-2 text-[#1c2942]/70 group-hover:text-[#1c2942] transition-colors">
                      Se souvenir de moi
                    </span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="font-medium text-[#6d74b5] hover:text-[#1c2942] transition-colors"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  fullWidth
                >
                  <LogIn className="w-4 h-4" />
                  Se connecter
                </Button>
              </form>
            </FormProvider>

            <div className="mt-6 pt-6 border-t border-[#1c2942]/10 text-center">
              <p className="text-sm text-[#1c2942]/60">
                Pas encore de compte ?{" "}
                <Link
                  to="/register/intervenant"
                  className="font-semibold text-[#6d74b5] hover:text-[#1c2942] transition-colors"
                >
                  S'inscrire comme intervenant
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-[#1c2942]/50 hover:text-[#1c2942] transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Retour à l'accueil
            </Link>
          </div>

          <p className="mt-6 text-center text-xs text-[#1c2942]/40">
            En vous connectant, vous acceptez nos{" "}
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
