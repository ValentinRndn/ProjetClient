import React from "react";
import { Navigate } from "react-router-dom";
import * as auth from "../lib/auth";
import LoadingSpinner from "./common/LoadingSpinner";

/**
 * Composant pour protéger les routes nécessitant une authentification
 * Redirige vers /login si l'utilisateur n'est pas authentifié
 * @param {Object} props
 * @param {React.ReactNode} props.children - Composant à afficher si authentifié
 */
export default function ProtectedRoute({ children }) {
  const isAuthenticated = auth.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
