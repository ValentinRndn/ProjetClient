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
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Récupère le token de rafraîchissement depuis LocalStorage
 * @returns {string|null} Le token de rafraîchissement ou null
 */
export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Stocke les tokens dans LocalStorage
 * @param {string} accessToken - Le token d'accès
 * @param {string} refreshToken - Le token de rafraîchissement
 */
export function setTokens(accessToken: string, refreshToken: string): void {
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
export function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/**
 * Vérifie si l'utilisateur est authentifié (a un token d'accès)
 * @returns {boolean} true si un token est présent, false sinon
 */
export function isAuthenticated(): boolean {
  return getAccessToken() !== null;
}
