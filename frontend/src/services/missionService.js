import apiClient from "../lib/apiClient";

/**
 * Service des missions
 * Gère toutes les opérations liées aux missions
 */

/**
 * Liste toutes les missions avec filtres et pagination
 * @param {Object} [filters] - Filtres de recherche
 * @param {string} [filters.ecoleId] - Filtrer par école (UUID)
 * @param {string} [filters.intervenantId] - Filtrer par intervenant (UUID)
 * @param {string} [filters.status] - Filtrer par statut (DRAFT, ACTIVE, COMPLETED)
 * @param {number} [filters.take] - Nombre de résultats (1-100, défaut: 50)
 * @param {number} [filters.skip] - Nombre de résultats à sauter (défaut: 0)
 * @param {string} [filters.q] - Recherche textuelle (max 100 caractères)
 * @returns {Promise<Object>} Liste des missions
 */
export async function getAllMissions(filters = {}) {
  try {
    const params = new URLSearchParams();

    if (filters.ecoleId) params.append("ecoleId", filters.ecoleId);
    if (filters.intervenantId)
      params.append("intervenantId", filters.intervenantId);
    if (filters.status) params.append("status", filters.status);
    if (filters.take) params.append("take", filters.take.toString());
    if (filters.skip) params.append("skip", filters.skip.toString());
    if (filters.q) params.append("q", filters.q);

    const queryString = params.toString();
    const url = `/missions${queryString ? `?${queryString}` : ""}`;

    const response = await apiClient.get(url);
    return response.data || response;
  } catch (error) {
    throw error;
  }
}

/**
 * Liste les missions de l'école connectée
 * @returns {Promise<Object>} Liste des missions de l'école
 */
export async function getMyEcoleMissions() {
  try {
    const response = await apiClient.get("/missions/ecole");
    return response.data || response;
  } catch (error) {
    throw error;
  }
}

/**
 * Liste les missions de l'intervenant connecté
 * @returns {Promise<Object>} Liste des missions de l'intervenant
 */
export async function getMyIntervenantMissions() {
  try {
    const response = await apiClient.get("/missions/intervenant");
    return response.data || response;
  } catch (error) {
    throw error;
  }
}

/**
 * Récupérer une mission par son ID
 * @param {string} id - ID de la mission
 * @returns {Promise<Object>} Données de la mission
 */
export async function getMissionById(id) {
  try {
    const response = await apiClient.get(`/missions/${id}`);
    return response.data || response;
  } catch (error) {
    throw error;
  }
}

/**
 * Créer une nouvelle mission
 * @param {Object} data - Données de la mission
 * @param {string} data.title - Titre de la mission
 * @param {string} data.description - Description détaillée
 * @param {string} [data.status] - Statut (DRAFT, ACTIVE)
 * @param {string} data.startDate - Date de début (ISO 8601)
 * @param {string} data.endDate - Date de fin (ISO 8601)
 * @param {number} data.priceCents - Prix en centimes
 * @returns {Promise<Object>} Mission créée
 */
export async function createMission(data) {
  try {
    const response = await apiClient.post("/missions", data);
    return response.data || response;
  } catch (error) {
    throw error;
  }
}

/**
 * Mettre à jour une mission
 * @param {string} id - ID de la mission
 * @param {Object} data - Données à mettre à jour
 * @param {string} [data.title] - Nouveau titre
 * @param {string} [data.description] - Nouvelle description
 * @param {number} [data.priceCents] - Nouveau prix
 * @returns {Promise<Object>} Mission mise à jour
 */
export async function updateMission(id, data) {
  try {
    const response = await apiClient.patch(`/missions/${id}`, data);
    return response.data || response;
  } catch (error) {
    throw error;
  }
}

/**
 * Changer le statut d'une mission
 * @param {string} id - ID de la mission
 * @param {string} status - Nouveau statut (DRAFT, ACTIVE, COMPLETED)
 * @returns {Promise<Object>} Mission mise à jour
 */
export async function updateMissionStatus(id, status) {
  try {
    const response = await apiClient.patch(`/missions/${id}/status`, {
      status,
    });
    return response.data || response;
  } catch (error) {
    throw error;
  }
}

/**
 * Affecter un intervenant à une mission
 * @param {string} missionId - ID de la mission
 * @param {string} intervenantId - ID de l'intervenant
 * @returns {Promise<Object>} Mission mise à jour
 */
export async function assignIntervenant(missionId, intervenantId) {
  try {
    const response = await apiClient.post(`/missions/${missionId}/assign`, {
      intervenantId,
    });
    return response.data || response;
  } catch (error) {
    throw error;
  }
}

/**
 * Supprimer une mission
 * @param {string} id - ID de la mission
 * @returns {Promise<Object>} Réponse de suppression
 */
export async function deleteMission(id) {
  try {
    const response = await apiClient.delete(`/missions/${id}`);
    return response.data || response;
  } catch (error) {
    throw error;
  }
}
