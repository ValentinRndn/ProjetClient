import { useForm, FormProvider } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { FormCard } from "@/components/ui/FormCard";
import { PageContainer } from "@/components/ui/PageContainer";
import { LogoIcon } from "@/components/ui/LogoIcon";
import { loginFormFields } from "@/config/loginFormConfig";
import { useState } from "react";
import { FormField } from "@/components/shared/FormField";

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

  const footer = (
    <div className="text-center">
      <p className="text-sm text-gray-600">
        Pas encore de compte ?{" "}
        <Link
          to="/register"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Créer un compte
        </Link>
      </p>
    </div>
  );

  return (
    <PageContainer
      className="bg-linear-to-br from-gray-50 to-gray-100"
      maxWidth="md"
    >
      <FormCard
        title="Bienvenue sur Vizion Academy"
        subtitle="Connectez-vous à votre compte pour continuer"
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
            <div className="space-y-5">
              {loginFormFields.map((field) => (
                <FormField key={field.name} field={field} />
              ))}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register("rememberMe")}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-gray-600">Se souvenir de moi</span>
              </label>
              <Link
                to="/forgot-password"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              Se connecter
            </Button>
          </form>
        </FormProvider>
      </FormCard>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          En vous connectant, vous acceptez nos{" "}
          <a href="#" className="text-indigo-600 hover:underline">
            conditions d'utilisation
          </a>{" "}
          et notre{" "}
          <a href="#" className="text-indigo-600 hover:underline">
            politique de confidentialité
          </a>
        </p>
      </div>
    </PageContainer>
  );
}
