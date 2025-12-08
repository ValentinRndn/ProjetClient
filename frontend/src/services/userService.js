import apiClient from "../lib/apiClient";

/**
 * Service des utilisateurs
 * Gère toutes les opérations liées aux utilisateurs (admin)
 */

/**
 * Liste tous les utilisateurs avec filtres et pagination
 * @param {Object} [filters] - Filtres de recherche
 * @param {number} [filters.take] - Nombre de résultats (1-100, défaut: 50)
 * @param {number} [filters.skip] - Nombre de résultats à sauter (défaut: 0)
 * @param {string} [filters.role] - Filtrer par rôle (ADMIN, ECOLE, INTERVENANT)
 * @param {string} [filters.q] - Recherche textuelle (max 100 caractères)
 * @returns {Promise<Object>} Liste des utilisateurs
 */
export async function getAllUsers(filters = {}) {
  try {
    const params = new URLSearchParams();

    if (filters.take) params.append("take", filters.take.toString());
    if (filters.skip) params.append("skip", filters.skip.toString());
    if (filters.role) params.append("role", filters.role);
    if (filters.q) params.append("q", filters.q);

    const queryString = params.toString();
    const url = `/users${queryString ? `?${queryString}` : ""}`;

    const response = await apiClient.get(url);
    return response.data || response;
  } catch (error) {
    throw error;
  }
}

/**
 * Récupérer un utilisateur par son ID
 * @param {string} id - ID de l'utilisateur
 * @returns {Promise<Object>} Données de l'utilisateur
 */
export async function getUserById(id) {
  try {
    const response = await apiClient.get(`/users/${id}`);
    return response.data || response;
  } catch (error) {
    throw error;
  }
}

/**
 * Créer un nouvel utilisateur (admin uniquement)
 * @param {Object} data - Données de l'utilisateur
 * @param {string} data.email - Email de l'utilisateur
 * @param {string} data.password - Mot de passe
 * @param {string} data.role - Rôle (ECOLE, INTERVENANT, ADMIN)
 * @returns {Promise<Object>} Utilisateur créé
 */
export async function createUser(data) {
  try {
    const response = await apiClient.post("/users", data);
    return response.data || response;
  } catch (error) {
    throw error;
  }
}

/**
 * Mettre à jour un utilisateur
 * @param {string} id - ID de l'utilisateur
 * @param {Object} data - Données à mettre à jour
 * @param {string} [data.email] - Nouvel email
 * @param {string} [data.password] - Nouveau mot de passe
 * @returns {Promise<Object>} Utilisateur mis à jour
 */
export async function updateUser(id, data) {
  try {
    const response = await apiClient.patch(`/users/${id}`, data);
    return response.data || response;
  } catch (error) {
    throw error;
  }
}

/**
 * Supprimer un utilisateur (admin uniquement)
 * @param {string} id - ID de l'utilisateur
 * @returns {Promise<Object>} Réponse de suppression
 */
export async function deleteUser(id) {
  try {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data || response;
  } catch (error) {
    throw error;
  }
}

/**
 * Changer le rôle d'un utilisateur (admin uniquement)
 * @param {string} id - ID de l'utilisateur
 * @param {string} role - Nouveau rôle (ECOLE, INTERVENANT, ADMIN)
 * @returns {Promise<Object>} Utilisateur mis à jour
 */
export async function updateUserRole(id, role) {
  try {
    const response = await apiClient.patch(`/users/${id}/role`, { role });
    return response.data || response;
  } catch (error) {
    throw error;
  }
}
