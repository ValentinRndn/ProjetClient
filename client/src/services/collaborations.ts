/**
 * Service des collaborations
 * Gère les collaborations entre écoles et intervenants
 */

import apiClient from "@/lib/api";

export type CollaborationStatus = "brouillon" | "en_cours" | "terminee" | "annulee";

export interface Collaboration {
  id: string;
  ecoleId: string;
  intervenantId: string;
  titre: string;
  description?: string;
  dateDebut?: string;
  dateFin?: string;
  montantHT?: number;
  status: CollaborationStatus;
  createdBy: "ecole" | "intervenant";
  validatedByEcole: boolean;
  validatedByIntervenant: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  ecole?: {
    id: string;
    name: string;
    contactEmail?: string;
  };
  intervenant?: {
    id: string;
    firstName?: string;
    lastName?: string;
    profileImage?: string;
    phone?: string;
    city?: string;
    user?: {
      email: string;
    };
  };
}

export interface CreateCollaborationData {
  ecoleId?: string;
  intervenantId?: string;
  titre: string;
  description?: string;
  dateDebut?: string;
  dateFin?: string;
  montantHT?: number;
  notes?: string;
}

export interface UpdateCollaborationData {
  titre?: string;
  description?: string;
  dateDebut?: string;
  dateFin?: string;
  montantHT?: number;
  notes?: string;
}

export interface CollaborationListResponse {
  items: Collaboration[];
  total: number;
}

export interface EcoleSearch {
  id: string;
  name: string;
  contactEmail?: string;
  address?: string;
}

export interface IntervenantSearch {
  id: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  city?: string;
  user?: {
    email: string;
  };
}

/**
 * Récupérer mes collaborations
 */
export async function getMyCollaborations(
  status?: CollaborationStatus
): Promise<CollaborationListResponse> {
  const params = new URLSearchParams();
  if (status) params.append("status", status);

  const response = await apiClient.get<CollaborationListResponse>(
    `/collaborations${params.toString() ? `?${params.toString()}` : ""}`
  );
  return response.data;
}

/**
 * Récupérer une collaboration par ID
 */
export async function getCollaborationById(id: string): Promise<Collaboration> {
  const response = await apiClient.get<Collaboration>(`/collaborations/${id}`);
  return response.data;
}

/**
 * Créer une nouvelle collaboration
 */
export async function createCollaboration(
  data: CreateCollaborationData
): Promise<Collaboration> {
  const response = await apiClient.post<Collaboration>("/collaborations", data);
  return response.data;
}

/**
 * Mettre à jour une collaboration
 */
export async function updateCollaboration(
  id: string,
  data: UpdateCollaborationData
): Promise<Collaboration> {
  const response = await apiClient.put<Collaboration>(`/collaborations/${id}`, data);
  return response.data;
}

/**
 * Valider une collaboration (confirmer sa participation)
 */
export async function validateCollaboration(id: string): Promise<Collaboration> {
  const response = await apiClient.post<Collaboration>(`/collaborations/${id}/validate`);
  return response.data;
}

/**
 * Changer le statut d'une collaboration
 */
export async function updateCollaborationStatus(
  id: string,
  status: CollaborationStatus
): Promise<Collaboration> {
  const response = await apiClient.patch<Collaboration>(`/collaborations/${id}/status`, {
    status,
  });
  return response.data;
}

/**
 * Supprimer une collaboration
 */
export async function deleteCollaboration(id: string): Promise<{ success: boolean }> {
  const response = await apiClient.delete<{ success: boolean }>(`/collaborations/${id}`);
  return response.data;
}

/**
 * Rechercher des écoles (pour les intervenants)
 */
export async function searchEcoles(query: string): Promise<EcoleSearch[]> {
  const response = await apiClient.get<EcoleSearch[]>(
    `/collaborations/search/ecoles?q=${encodeURIComponent(query)}`
  );
  return response.data;
}

/**
 * Rechercher des intervenants (pour les écoles)
 */
export async function searchIntervenants(query: string): Promise<IntervenantSearch[]> {
  const response = await apiClient.get<IntervenantSearch[]>(
    `/collaborations/search/intervenants?q=${encodeURIComponent(query)}`
  );
  return response.data;
}
