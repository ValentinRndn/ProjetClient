// @ts-nocheck
import axios from "axios";
import * as auth from "./auth";

/**
 * Client API de base avec configuration Axios
 * Gère l'authentification JWT, le refresh automatique et les erreurs
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api/v1";
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || "10000", 10);

// Créer l'instance Axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Variable pour éviter les boucles infinies de refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Intercepteur de requête : ajout automatique du token JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = auth.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse : gestion des erreurs et refresh automatique
apiClient.interceptors.response.use(
  (response) => {
    // Retourner directement les données si la structure est { success: true, data: ... }
    if (response.data && response.data.success !== undefined) {
      return response.data;
    }
    // Sinon retourner la réponse complète
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si erreur 401 (non autorisé) et pas déjà en train de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si déjà en train de refresh, mettre en queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = auth.getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Appeler l'API pour rafraîchir le token
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data || response.data;

        // Sauvegarder les nouveaux tokens
        if (accessToken) {
          auth.setTokens(accessToken, newRefreshToken || refreshToken);

          // Mettre à jour le header de la requête originale
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          // Traiter la queue
          processQueue(null, accessToken);

          // Réessayer la requête originale
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Échec du refresh : déconnecter l'utilisateur
        processQueue(refreshError, null);
        auth.clearTokens();

        // Rediriger vers la page de login si on est dans un contexte navigateur
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Formater les erreurs de manière uniforme avec messages clairs
    let errorMessage = "Une erreur est survenue";

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      // Messages d'erreur personnalisés selon le code HTTP
      switch (status) {
        case 400:
          errorMessage =
            data?.message ||
            "Les données envoyées sont invalides. Veuillez vérifier vos informations.";
          break;
        case 401:
          errorMessage = "Votre session a expiré. Veuillez vous reconnecter.";
          break;
        case 403:
          errorMessage =
            data?.message ||
            "Vous n'avez pas les permissions nécessaires pour effectuer cette action.";
          break;
        case 404:
          errorMessage =
            data?.message || "La ressource demandée n'a pas été trouvée.";
          break;
        case 409:
          errorMessage =
            data?.message ||
            "Un conflit est survenu. Cette ressource existe déjà.";
          break;
        case 500:
          errorMessage =
            "Une erreur serveur est survenue. Veuillez réessayer plus tard.";
          break;
        default:
          errorMessage =
            data?.message || `Erreur ${status}: Une erreur est survenue.`;
      }

      // Si plusieurs erreurs de validation, les combiner
      if (data?.errors && Array.isArray(data.errors)) {
        errorMessage = data.errors.map((e) => e.message || e).join(", ");
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    const formattedError = {
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
      originalError: error,
    };

    return Promise.reject(formattedError);
  }
);

export default apiClient;
