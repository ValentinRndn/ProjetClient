import apiClient from "../lib/apiClient";

/**
 * Service des écoles
 * Gère toutes les opérations liées aux écoles
 */

/**
 * Liste publique des écoles (pour filtres)
 * @returns {Promise<Object>} Liste des écoles (id et name seulement)
 */
export async function getPublicEcoles() {
  try {
    const response = await apiClient.get("/ecoles/public");
    return response.data || response;
  } catch (error) {
    throw error;
  }
}

/**
 * Liste toutes les écoles (ADMIN only)
 * @returns {Promise<Object>} Liste complète des écoles
 */
export async function getAllEcoles() {
  try {
    const response = await apiClient.get("/ecoles");
    return response.data || response;
  } catch (error) {
    throw error;
  }
}

/**
 * Récupérer une école par son ID
 * @param {string} id - ID de l'école
 * @returns {Promise<Object>} Données de l'école
 */
export async function getEcoleById(id) {
  try {
    const response = await apiClient.get(`/ecoles/${id}`);
    return response.data || response;
  } catch (error) {
    throw error;
  }
}

/**
 * Créer une nouvelle école
 * @param {Object} data - Données de l'école
 * @param {string} data.name - Nom de l'école
 * @param {string} data.contactEmail - Email de contact
 * @param {string} [data.address] - Adresse
 * @param {string} [data.phone] - Téléphone
 * @returns {Promise<Object>} École créée
 */
export async function createEcole(data) {
  try {
    const response = await apiClient.post("/ecoles", data);
    return response.data || response;
  } catch (error) {
    throw error;
  }
}

/**
 * Mettre à jour une école
 * @param {string} id - ID de l'école
 * @param {Object} data - Données à mettre à jour
 * @param {string} [data.name] - Nouveau nom
 * @param {string} [data.contactEmail] - Nouvel email de contact
 * @param {string} [data.address] - Nouvelle adresse
 * @param {string} [data.phone] - Nouveau téléphone
 * @returns {Promise<Object>} École mise à jour
 */
export async function updateEcole(id, data) {
  try {
    const response = await apiClient.patch(`/ecoles/${id}`, data);
    return response.data || response;
  } catch (error) {
    throw error;
  }
}

/**
 * Supprimer une école
 * @param {string} id - ID de l'école
 * @returns {Promise<Object>} Réponse de suppression
 */
export async function deleteEcole(id) {
  try {
    const response = await apiClient.delete(`/ecoles/${id}`);
    return response.data || response;
  } catch (error) {
    throw error;
  }
}

/**
 * Récupérer le dashboard d'une école (stats, missions, etc.)
 * @param {string} id - ID de l'école
 * @returns {Promise<Object>} Données du dashboard
 */
export async function getEcoleDashboard(id) {
  try {
    const response = await apiClient.get(`/ecoles/${id}/dashboard`);
    return response.data || response;
  } catch (error) {
    throw error;
  }
}

/**
 * Déclarer une nouvelle mission pour l'école
 * @param {string} ecoleId - ID de l'école
 * @param {Object} missionData - Données de la mission
 * @returns {Promise<Object>} Mission déclarée
 */
export async function declareMission(ecoleId, missionData) {
  try {
    const response = await apiClient.post(
      `/ecoles/${ecoleId}/declare-mission`,
      missionData
    );
    return response.data || response;
  } catch (error) {
    throw error;
  }
}
