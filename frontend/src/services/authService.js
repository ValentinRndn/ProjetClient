// @ts-nocheck
import apiClient from "../lib/apiClient";
import * as auth from "../lib/auth";

/**
 * Service d'authentification
 * Gère toutes les opérations liées à l'authentification des utilisateurs
 */

/**
 * Inscription d'un nouvel utilisateur
 * @param {Object} data - Données d'inscription
 * @param {string} data.email - Email de l'utilisateur
 * @param {string} data.password - Mot de passe
 * @param {string} data.role - Rôle (ECOLE, INTERVENANT, ADMIN)
 * @param {Object} [data.ecoleData] - Données de l'école si role = ECOLE
 * @param {Object} [data.intervenantData] - Données de l'intervenant si role = INTERVENANT
 * @returns {Promise<Object>} Réponse avec tokens et données utilisateur
 */
export async function register(data) {
  try {
    const response = await apiClient.post("/auth/register", data);
    const { accessToken, refreshToken, user } = response.data || response;

    // Sauvegarder les tokens
    if (accessToken && refreshToken) {
      auth.setTokens(accessToken, refreshToken);
    }

    return {
      success: true,
      user,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Connexion d'un utilisateur
 * @param {string} email - Email de l'utilisateur
 * @param {string} password - Mot de passe
 * @returns {Promise<Object>} Réponse avec tokens et données utilisateur
 */
export async function login(email, password) {
  try {
    const response = await apiClient.post("/auth/login", { email, password });
    const { accessToken, refreshToken, user } = response.data || response;

    // Sauvegarder les tokens
    if (accessToken && refreshToken) {
      auth.setTokens(accessToken, refreshToken);
    }

    return {
      success: true,
      user,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Déconnexion d'un utilisateur
 * @param {string} [refreshToken] - Token de rafraîchissement (optionnel)
 * @returns {Promise<Object>} Réponse de déconnexion
 */
export async function logout(refreshToken = null) {
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

  return { success: true };
}

/**
 * Rafraîchir le token d'accès
 * @param {string} [refreshToken] - Token de rafraîchissement (optionnel)
 * @returns {Promise<Object>} Nouveaux tokens
 */
export async function refreshToken(refreshToken = null) {
  try {
    const token = refreshToken || auth.getRefreshToken();
    if (!token) {
      throw new Error("No refresh token available");
    }

    const response = await apiClient.post("/auth/refresh", {
      refreshToken: token,
    });
    const { accessToken, refreshToken: newRefreshToken } =
      response.data || response;

    // Sauvegarder les nouveaux tokens
    if (accessToken) {
      auth.setTokens(accessToken, newRefreshToken || token);
    }

    return {
      success: true,
      accessToken,
      refreshToken: newRefreshToken || token,
    };
  } catch (error) {
    auth.clearTokens();
    throw error;
  }
}

/**
 * Récupérer les informations de l'utilisateur connecté
 * @returns {Promise<Object>} Données de l'utilisateur
 */
export async function getCurrentUser() {
  try {
    const response = await apiClient.get("/auth/me");
    const { user } = response.data || response;
    return {
      success: true,
      user,
    };
  } catch (error) {
    throw error;
  }
}
