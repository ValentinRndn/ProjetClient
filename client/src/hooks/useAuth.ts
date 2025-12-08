/**
 * Hook d'authentification
 * Gère l'état d'authentification et les opérations liées
 */

import { useState, useEffect, useCallback } from "react";
import * as authService from "@/services/auth";
import * as authUtils from "@/lib/auth";
import type { User, RegisterData } from "@/services/auth";

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    const loadUser = async () => {
      if (!authUtils.isAuthenticated()) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        // Token invalide ou expiré
        authUtils.clearTokens();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await authService.login(email, password);
      setUser(response.user);
    } catch (err) {
      const errorMessage =
        (err as { message?: string }).message ||
        "Erreur lors de la connexion. Vérifiez vos identifiants.";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await authService.register(data);
      setUser(response.user);
    } catch (err) {
      const errorMessage =
        (err as { message?: string }).message ||
        "Erreur lors de l'inscription. Veuillez réessayer.";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setError(null);
      await authService.logout();
      setUser(null);
    } catch (err) {
      // Même en cas d'erreur, on déconnecte localement
      authUtils.clearTokens();
      setUser(null);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      authUtils.clearTokens();
      setUser(null);
      throw err;
    }
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user && authUtils.isAuthenticated(),
    error,
    login,
    register,
    logout,
    refreshUser,
  };
}
