import apiClient from "../lib/apiClient";

/**
 * Service des intervenants
 * Gère toutes les opérations liées aux intervenants
 */

/**
 * Liste tous les intervenants avec filtres et pagination
 * @param {Object} [filters] - Filtres de recherche
 * @param {number} [filters.take] - Nombre de résultats (1-100, défaut: 50)
 * @param {number} [filters.skip] - Nombre de résultats à sauter (défaut: 0)
 * @param {string} [filters.status] - Filtrer par statut (pending, approved, rejected)
 * @returns {Promise<Object>} Liste des intervenants
 */
export async function getAllIntervenants(filters = {}) {
  try {
    const params = new URLSearchParams();

    if (filters.take) params.append("take", filters.take.toString());
    if (filters.skip) params.append("skip", filters.skip.toString());
    if (filters.status) params.append("status", filters.status);

    const queryString = params.toString();
    const url = `/intervenants${queryString ? `?${queryString}` : ""}`;

    const response = await apiClient.get(url);
    return response.data || response;
  } catch (error) {
    throw error;
  }
}

/**
 * Récupérer un intervenant par son ID
 * @param {string} id - ID de l'intervenant
 * @returns {Promise<Object>} Données de l'intervenant
 */
export async function getIntervenantById(id) {
  try {
    const response = await apiClient.get(`/intervenants/${id}`);
    return response.data || response;
  } catch (error) {
    throw error;
  }
}

/**
 * Mettre à jour un intervenant
 * @param {string} id - ID de l'intervenant
 * @param {Object} data - Données à mettre à jour
 * @param {string} [data.bio] - Nouvelle biographie
 * @param {string} [data.siret] - Nouveau SIRET
 * @param {Object} [data.disponibility] - Nouvelles disponibilités
 * @returns {Promise<Object>} Intervenant mis à jour
 */
export async function updateIntervenant(id, data) {
  try {
    const response = await apiClient.patch(`/intervenants/${id}`, data);
    return response.data || response;
  } catch (error) {
    throw error;
  }
}

/**
 * Changer le statut d'un intervenant (validation admin)
 * @param {string} id - ID de l'intervenant
 * @param {string} status - Nouveau statut (pending, approved, rejected)
 * @returns {Promise<Object>} Intervenant mis à jour
 */
export async function updateIntervenantStatus(id, status) {
  try {
    const response = await apiClient.patch(`/intervenants/${id}/status`, {
      status,
    });
    return response.data || response;
  } catch (error) {
    throw error;
  }
}

/**
 * Liste tous les documents d'un intervenant
 * @param {string} id - ID de l'intervenant
 * @returns {Promise<Object>} Liste des documents
 */
export async function getIntervenantDocuments(id) {
  try {
    const response = await apiClient.get(`/intervenants/${id}/documents`);
    return response.data || response;
  } catch (error) {
    throw error;
  }
}

/**
 * Uploader un document pour un intervenant
 * @param {string} id - ID de l'intervenant
 * @param {Object} documentData - Données du document
 * @param {string} documentData.fileName - Nom du fichier
 * @param {string} documentData.filePath - Chemin du fichier (ex: s3://bucket/file.pdf)
 * @param {string} documentData.type - Type de document (CV, RIB, KBIS, DIPLOME, AUTRE)
 * @returns {Promise<Object>} Document créé
 */
export async function uploadDocument(id, documentData) {
  try {
    const response = await apiClient.post(
      `/intervenants/${id}/documents`,
      documentData
    );
    return response.data || response;
  } catch (error) {
    throw error;
  }
}

/**
 * Supprimer un document
 * @param {string} id - ID de l'intervenant
 * @param {string} docId - ID du document
 * @returns {Promise<Object>} Réponse de suppression
 */
export async function deleteDocument(id, docId) {
  try {
    const response = await apiClient.delete(
      `/intervenants/${id}/documents/${docId}`
    );
    return response.data || response;
  } catch (error) {
    throw error;
  }
}
