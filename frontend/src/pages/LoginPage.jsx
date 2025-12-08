import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import { Mail, Lock, LogIn } from "lucide-react";

/**
 * Page de connexion
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!formData.email || !formData.password) {
      setLocalError("Veuillez remplir tous les champs");
      return;
    }

    try {
      const response = await login(formData.email, formData.password);
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
        "Erreur lors de la connexion. Vérifiez vos identifiants.";
      setLocalError(errorMessage);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
          <h2 className="text-3xl font-extrabold text-bleu-nuit">Connexion</h2>
          <p className="mt-2 text-sm text-gray-600">
            Connectez-vous à votre compte Vizion Academy
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Message d'erreur */}
            {(error || localError) && (
              <ErrorMessage error={error || localError} />
            )}

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
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-violet focus:border-indigo-violet text-gray-900 placeholder-gray-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

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
                    <LogIn size={18} />
                    Se connecter
                  </>
                )}
              </button>
            </div>

            {/* Lien d'inscription */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Vous n'avez pas de compte ?{" "}
                <Link
                  to="/register"
                  className="font-medium text-indigo-violet hover:text-bleu-nuit"
                >
                  Créer un compte
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
