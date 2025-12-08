import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { RoleSelector } from "@/components/ui/RoleSelector";
import { FormCard } from "@/components/ui/FormCard";
import { PageContainer } from "@/components/ui/PageContainer";
import { LogoIcon } from "@/components/ui/LogoIcon";
import type { RegisterData } from "@/services/auth";
import { Mail, Lock, Building2, MapPin, Phone } from "lucide-react";

export function RegisterForm() {
  const { register, error, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    role: "INTERVENANT" as "ECOLE" | "INTERVENANT",
    ecoleData: {
      name: "",
      contactEmail: "",
      address: "",
      phone: "",
    },
    intervenantData: {
      bio: "",
      siret: "",
    },
  });
  const [localError, setLocalError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Redirection après inscription réussie
  useEffect(() => {
    if (user) {
      if (user) {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Le mot de passe doit contenir au moins 8 caractères";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);
    setPasswordError(null);

    // Validation des champs obligatoires
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setLocalError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Validation du mot de passe
    const pwdError = validatePassword(formData.password);
    if (pwdError) {
      setPasswordError(pwdError);
      return;
    }

    // Validation de la confirmation du mot de passe
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas");
      return;
    }

    // Validation des données spécifiques au rôle
    if (formData.role === "ECOLE" && !formData.ecoleData.name) {
      setLocalError("Le nom de l'école est requis");
      return;
    }

    // Préparer les données pour l'API
    const registrationData: RegisterData = {
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    if (formData.name) {
      registrationData.name = formData.name;
    }

    if (formData.role === "ECOLE") {
      registrationData.ecoleData = {
        name: formData.ecoleData.name,
        contactEmail: formData.ecoleData.contactEmail || undefined,
        address: formData.ecoleData.address || undefined,
        phone: formData.ecoleData.phone || undefined,
      };
    } else if (formData.role === "INTERVENANT") {
      registrationData.intervenantData = {
        bio: formData.intervenantData.bio || undefined,
        siret: formData.intervenantData.siret || undefined,
      };
    }

    try {
      await register(registrationData);
    } catch (err: unknown) {
      const errorObj = err as { message?: string; status?: number };
      setLocalError(errorObj?.message || "Erreur lors de l'inscription");
    }
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
      className="bg-gradient-to-br from-gray-50 to-gray-100"
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sélection du type de compte */}
          <RoleSelector
            value={formData.role}
            onChange={(role) => setFormData({ ...formData, role })}
            disabled={isLoading}
          />

          {/* Informations de base */}
          <div className="space-y-5 pt-6 border-t border-gray-200">
            <div className="relative">
              <Mail className="absolute left-3 top-[38px] w-5 h-5 text-gray-400 pointer-events-none z-10" />
              <Input
                type="email"
                label="Email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
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
                placeholder="Minimum 8 caractères"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  setPasswordError(validatePassword(e.target.value));
                }}
                required
                autoComplete="new-password"
                disabled={isLoading}
                error={passwordError || undefined}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-[38px] w-5 h-5 text-gray-400 pointer-events-none z-10" />
              <Input
                type="password"
                label="Confirmer le mot de passe"
                placeholder="Répétez le mot de passe"
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value });
                  if (formData.password !== e.target.value) {
                    setPasswordError("Les mots de passe ne correspondent pas");
                  } else {
                    setPasswordError(null);
                  }
                }}
                required
                autoComplete="new-password"
                disabled={isLoading}
                error={
                  formData.confirmPassword &&
                  formData.password !== formData.confirmPassword
                    ? "Les mots de passe ne correspondent pas"
                    : undefined
                }
                className="pl-10"
              />
            </div>
          </div>

          {/* Champs conditionnels selon le rôle */}
          {formData.role === "ECOLE" && (
            <div className="space-y-5">
              <div className="relative">
                <Building2 className="absolute left-3 top-[38px] w-5 h-5 text-gray-400 pointer-events-none z-10" />
                <Input
                  type="text"
                  label="Nom de l'école"
                  placeholder="Nom de votre établissement"
                  value={formData.ecoleData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ecoleData: {
                        ...formData.ecoleData,
                        name: e.target.value,
                      },
                    })
                  }
                  required
                  disabled={isLoading}
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-[38px] w-5 h-5 text-gray-400 pointer-events-none z-10" />
                <Input
                  type="text"
                  label="Adresse"
                  placeholder="123 Rue de Paris, 75001 Paris"
                  value={formData.ecoleData.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ecoleData: {
                        ...formData.ecoleData,
                        address: e.target.value,
                      },
                    })
                  }
                  disabled={isLoading}
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-[38px] w-5 h-5 text-gray-400 pointer-events-none z-10" />
                <Input
                  type="tel"
                  label="Numéro de téléphone"
                  placeholder="01 23 45 67 89"
                  value={formData.ecoleData.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ecoleData: {
                        ...formData.ecoleData,
                        phone: e.target.value,
                      },
                    })
                  }
                  disabled={isLoading}
                  className="pl-10"
                />
              </div>
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
