/**
 * Service d'authentification
 * Gère toutes les opérations liées à l'authentification des utilisateurs
 */

import apiClient from "@/lib/api";
import * as auth from "@/lib/auth";

export type UserRole = "ADMIN" | "ECOLE" | "INTERVENANT";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  ecole?: {
    id: string;
    name: string;
    contactEmail?: string;
    address?: string;
    phone?: string;
  };
  intervenant?: {
    id: string;
    bio?: string;
    siret?: string;
    disponibility?: boolean;
    status?: string;
  };
}

export interface RegisterData {
  email: string;
  password: string;
  role: UserRole;
  name?: string;
  ecoleData?: {
    name: string;
    contactEmail?: string;
    address?: string;
    phone?: string;
  };
  intervenantData?: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    siret?: string;
  };
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn?: string;
}

/**
 * Inscription d'un nouvel utilisateur
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await apiClient.post<{
    success: boolean;
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresIn?: string;
  }>("/auth/register", data);

  const { accessToken, refreshToken, user } = response;

  // Sauvegarder les tokens
  if (accessToken && refreshToken) {
    auth.setTokens(accessToken, refreshToken);
  }

  return {
    success: true,
    user,
    accessToken,
    refreshToken,
    expiresIn: response.expiresIn,
  };
}

/**
 * Connexion d'un utilisateur
 */
export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await apiClient.post<{
    success: boolean;
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresIn?: string;
  }>("/auth/login", { email, password });

  const { accessToken, refreshToken, user } = response;

  // Sauvegarder les tokens
  if (accessToken && refreshToken) {
    auth.setTokens(accessToken, refreshToken);
  }

  return {
    success: true,
    user,
    accessToken,
    refreshToken,
    expiresIn: response.expiresIn,
  };
}

/**
 * Déconnexion d'un utilisateur
 */
export async function logout(refreshToken?: string): Promise<void> {
  try {
    const token = refreshToken || auth.getRefreshToken();
    if (token) {
      await apiClient.post("/auth/logout", { refreshToken: token });
    }
  } catch (error) {
    // Continuer même si l'appel API échoue
    console.error("Error during logout:", error);
  } finally {
    // Toujours supprimer les tokens localement
    auth.clearTokens();
  }
}

/**
 * Rafraîchir le token d'accès
 */
export async function refreshToken(refreshToken?: string): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  const token = refreshToken || auth.getRefreshToken();
  if (!token) {
    throw new Error("No refresh token available");
  }

  const response = await apiClient.post<{
    success: boolean;
    accessToken: string;
    refreshToken?: string;
  }>("/auth/refresh", { refreshToken: token });

  const { accessToken, refreshToken: newRefreshToken } = response;

  // Sauvegarder les nouveaux tokens
  if (accessToken) {
    auth.setTokens(accessToken, newRefreshToken || token);
  }

  return {
    accessToken,
    refreshToken: newRefreshToken || token,
  };
}

/**
 * Récupérer les informations de l'utilisateur connecté
 */
export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<{
    success: boolean;
    user: User;
  }>("/auth/me");

  return response.user;
}
