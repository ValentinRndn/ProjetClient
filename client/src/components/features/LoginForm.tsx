import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { FormCard } from "@/components/ui/FormCard";
import { PageContainer } from "@/components/ui/PageContainer";
import { LogoIcon } from "@/components/ui/LogoIcon";
import { Mail, Lock } from "lucide-react";

export function LoginForm() {
  const { login, error, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  // Redirection après connexion réussie
  useEffect(() => {
    if (user) {
      const role = user.role;
      if (role === "ECOLE") {
        navigate("/dashboard-ecole");
      } else if (role === "INTERVENANT") {
        navigate("/dashboard-intervenant");
      } else if (role === "ADMIN") {
        navigate("/dashboard-ecole");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError("Veuillez remplir tous les champs");
      return;
    }

    try {
      await login(email, password);
    } catch (err: unknown) {
      // L'erreur est déjà formatée par l'intercepteur API avec { message, status, ... }
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-3 top-[38px] w-5 h-5 text-gray-400 pointer-events-none z-10" />
              <Input
                type="email"
                label="Adresse email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={isLoading}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-[38px] w-5 h-5 text-gray-400 pointer-events-none z-10" />
              <Input
                type="password"
                label="Mot de passe"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={isLoading}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input
                type="checkbox"
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
