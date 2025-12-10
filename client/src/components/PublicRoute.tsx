/**
 * Composant pour les routes publiques
 * Redirige vers une page spécifique (par défaut /dashboard) si l'utilisateur est déjà connecté
 */

import { Navigate } from "react-router";
import * as auth from "@/lib/auth";

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function PublicRoute({
  children,
  redirectTo = "/",
}: PublicRouteProps) {
  const isAuthenticated = auth.isAuthenticated();

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
