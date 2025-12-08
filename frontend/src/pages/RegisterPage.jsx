import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import { Mail, Lock, Building2, UserCheck } from "lucide-react";

/**
 * Page d'inscription
 */
export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "INTERVENANT",
    ecoleData: {
      name: "",
    },
    intervenantData: {
      bio: "",
    },
  });
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    // Validation
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setLocalError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.password.length < 8) {
      setLocalError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    // Préparer les données pour l'API
    const registrationData = {
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    if (formData.role === "ECOLE" && formData.ecoleData.name) {
      registrationData.ecoleData = formData.ecoleData;
    }

    if (formData.role === "INTERVENANT" && formData.intervenantData.bio) {
      registrationData.intervenantData = formData.intervenantData;
    }

    try {
      const response = await register(registrationData);
      // Redirection selon le rôle
      const role = response?.user?.role;
      if (role === "ECOLE") {
        navigate("/dashboard-ecole");
      } else if (role === "INTERVENANT") {
        navigate("/dashboard-intervenant");
      } else if (role === "ADMIN") {
        navigate("/dashboard-ecole");
      } else {
        navigate("/");
      }
    } catch (err) {
      const errorMessage =
        err.message ||
        err.response?.data?.message ||
        "Erreur lors de l'inscription. Veuillez réessayer.";
      setLocalError(errorMessage);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("ecoleData.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        ecoleData: {
          ...formData.ecoleData,
          [field]: value,
        },
      });
    } else if (name.startsWith("intervenantData.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        intervenantData: {
          ...formData.intervenantData,
          [field]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  return (
    <div className="min-h-screen bg-blanc-teinte flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">V</span>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-bleu-nuit">
            Inscription
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Créez votre compte Vizion Academy
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Message d'erreur */}
            {(error || localError) && (
              <ErrorMessage error={error || localError} />
            )}

            {/* Rôle */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Type de compte
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, role: "INTERVENANT" })
                  }
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    formData.role === "INTERVENANT"
                      ? "border-indigo-violet bg-indigo-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <UserCheck className="h-6 w-6 mx-auto mb-2 text-indigo-violet" />
                  <span className="text-sm font-medium text-gray-700">
                    Intervenant
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "ECOLE" })}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    formData.role === "ECOLE"
                      ? "border-indigo-violet bg-indigo-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <Building2 className="h-6 w-6 mx-auto mb-2 text-indigo-violet" />
                  <span className="text-sm font-medium text-gray-700">
                    École
                  </span>
                </button>
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-violet focus:border-indigo-violet text-gray-900 placeholder-gray-400"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-violet focus:border-indigo-violet text-gray-900 placeholder-gray-400"
                  placeholder="Minimum 8 caractères"
                />
              </div>
            </div>

            {/* Confirmation mot de passe */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-violet focus:border-indigo-violet text-gray-900 placeholder-gray-400"
                  placeholder="Répétez le mot de passe"
                />
              </div>
            </div>

            {/* Champs conditionnels selon le rôle */}
            {formData.role === "ECOLE" && (
              <div>
                <label
                  htmlFor="ecoleData.name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nom de l'école
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="ecoleData.name"
                    name="ecoleData.name"
                    type="text"
                    value={formData.ecoleData.name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-violet focus:border-indigo-violet text-gray-900 placeholder-gray-400"
                    placeholder="Nom de votre établissement"
                  />
                </div>
              </div>
            )}

            {formData.role === "INTERVENANT" && (
              <div>
                <label
                  htmlFor="intervenantData.bio"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Biographie (optionnel)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                    <UserCheck className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id="intervenantData.bio"
                    name="intervenantData.bio"
                    rows={3}
                    value={formData.intervenantData.bio}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-violet focus:border-indigo-violet text-gray-900 placeholder-gray-400"
                    placeholder="Présentez-vous en quelques mots..."
                  />
                </div>
              </div>
            )}

            {/* Bouton de soumission */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-violet hover:bg-bleu-nuit focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-violet disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <LoadingSpinner size="small" />
                ) : (
                  <>
                    <UserCheck size={18} />
                    Créer mon compte
                  </>
                )}
              </button>
            </div>

            {/* Lien de connexion */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Vous avez déjà un compte ?{" "}
                <Link
                  to="/login"
                  className="font-medium text-indigo-violet hover:text-bleu-nuit"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Lien retour accueil */}
        <div className="text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-bleu-nuit">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
