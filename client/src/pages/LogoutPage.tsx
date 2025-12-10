import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export default function LogoutPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout();
      } catch (error) {
        // En cas d'erreur, on continue quand même la redirection
        console.error("Erreur lors de la déconnexion:", error);
      } finally {
        // Redirection vers la page de login
        navigate("/login", { replace: true });
      }
    };

    handleLogout();
  }, [logout, navigate]);

  // Afficher un message de chargement pendant la déconnexion
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Déconnexion en cours...</p>
      </div>
    </div>
  );
}
