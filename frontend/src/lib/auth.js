// @ts-nocheck
/**
 * Module de gestion de l'authentification
 * Gère le stockage et la récupération des tokens JWT dans LocalStorage
 */

const ACCESS_TOKEN_KEY = "vizion_academy_access_token";
const REFRESH_TOKEN_KEY = "vizion_academy_refresh_token";

/**
 * Récupère le token d'accès depuis LocalStorage
 * @returns {string|null} Le token d'accès ou null
 */
export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Récupère le token de rafraîchissement depuis LocalStorage
 * @returns {string|null} Le token de rafraîchissement ou null
 */
export function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Stocke les tokens dans LocalStorage
 * @param {string} accessToken - Le token d'accès
 * @param {string} refreshToken - Le token de rafraîchissement
 */
export function setTokens(accessToken, refreshToken) {
  if (typeof window === "undefined") return;
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

/**
 * Supprime les tokens de LocalStorage
 */
export function clearTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/**
 * Vérifie si l'utilisateur est authentifié (a un token d'accès)
 * @returns {boolean} true si un token est présent, false sinon
 */
export function isAuthenticated() {
  return getAccessToken() !== null;
}

/**
 * Rafraîchit le token d'accès en utilisant le refresh token
 * @returns {Promise<{accessToken: string, refreshToken?: string}>} Les nouveaux tokens
 * @throws {Error} Si le refresh échoue
 */
export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api/v1";
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    const { accessToken, refreshToken: newRefreshToken } = data.data || data;

    if (accessToken) {
      setTokens(accessToken, newRefreshToken || refreshToken);
      return { accessToken, refreshToken: newRefreshToken || refreshToken };
    }

    throw new Error("No access token in refresh response");
  } catch (error) {
    clearTokens();
    throw error;
  }
}
