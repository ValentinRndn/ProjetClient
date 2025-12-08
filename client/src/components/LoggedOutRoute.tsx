/**
 * Composant pour les routes accessibles uniquement aux utilisateurs non connectés
 * (ex: login, register)
 * Redirige vers la page d'accueil si déjà connecté
 */

import { Navigate } from "react-router";
import * as auth from "@/lib/auth";

interface LoggedOutRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function LoggedOutRoute({
  children,
  redirectTo = "/",
}: LoggedOutRouteProps) {
  const isAuthenticated = auth.isAuthenticated();

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
