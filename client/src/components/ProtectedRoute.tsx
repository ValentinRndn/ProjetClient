/**
 * Composant pour protéger une route
 * Redirige vers /login si l'utilisateur n'est pas authentifié
 */

import { Navigate } from "react-router";
import * as auth from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";

type Role = "ADMIN" | "ECOLE" | "INTERVENANT";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Role | Role[];
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const isAuthenticated = auth.isAuthenticated();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Vérifier le rôle si requis
  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!allowedRoles.includes(user.role as Role)) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
