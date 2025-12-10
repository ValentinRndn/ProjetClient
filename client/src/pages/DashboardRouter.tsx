import { Navigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardRouter() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Rediriger vers le bon dashboard selon le rôle
  switch (user.role) {
    case "ADMIN":
      return <Navigate to="/dashboard/admin" replace />;
    case "INTERVENANT":
      return <Navigate to="/dashboard/intervenant" replace />;
    case "ECOLE":
      return <Navigate to="/dashboard/ecole" replace />;
    default:
      return <Navigate to="/" replace />;
  }
}
