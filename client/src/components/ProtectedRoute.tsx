/**
 * Composant pour protéger une route
 * Redirige vers /login si l'utilisateur n'est pas authentifié
 */

import { Navigate } from "react-router";
import * as auth from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "ADMIN" | "ECOLE" | "INTERVENANT";
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const isAuthenticated = auth.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si un rôle spécifique est requis, il faudra vérifier le rôle de l'utilisateur
  // Pour l'instant, on laisse passer si authentifié
  // TODO: Implémenter la vérification de rôle si nécessaire

  return <>{children}</>;
}
