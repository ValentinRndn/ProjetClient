import { useState, useEffect, useCallback } from "react";
import * as authLib from "../lib/auth";
import * as authService from "../services/authService";

/**
 * Hook personnalisé pour gérer l'authentification
 * Fournit les états et fonctions nécessaires pour l'authentification dans les composants
 */
export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const hasToken = authLib.isAuthenticated();

        if (hasToken) {
          // Essayer de récupérer les infos de l'utilisateur
          try {
            const response = await authService.getCurrentUser();
            setUser(response.user);
            setIsAuthenticated(true);
          } catch (err) {
            // Token invalide, supprimer les tokens
            authLib.clearTokens();
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        setError(err.message);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Connecter un utilisateur
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe
   */
  const login = useCallback(async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.login(email, password);

      setUser(response.user);
      setIsAuthenticated(true);

      return response;
    } catch (err) {
      const errorMessage = err.message || "Erreur lors de la connexion";
      setError(errorMessage);
      setIsAuthenticated(false);
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Inscrire un nouvel utilisateur
   * @param {Object} data - Données d'inscription
   */
  const register = useCallback(async (data) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.register(data);

      setUser(response.user);
      setIsAuthenticated(true);

      return response;
    } catch (err) {
      const errorMessage = err.message || "Erreur lors de l'inscription";
      setError(errorMessage);
      setIsAuthenticated(false);
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Déconnecter l'utilisateur
   */
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (err) {
      console.error("Error during logout:", err);
    } finally {
      authLib.clearTokens();
      setIsAuthenticated(false);
      setUser(null);
      setError(null);
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    isAuthenticated,
    user,
    error,
    login,
    register,
    logout,
  };
}
