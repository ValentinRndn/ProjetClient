/**
 * Service des intervenants
 * Gère toutes les opérations liées aux intervenants
 */

import apiClient from "@/lib/api";

export interface Intervenant {
  id: string;
  bio?: string;
  siret?: string;
  disponibility?: boolean;
  status?: string;
  userId?: string;
  user?: {
    id: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Liste tous les intervenants
 */
export async function getAllIntervenants(): Promise<Intervenant[]> {
  const response = await apiClient.get<{
    success: boolean;
    data: Intervenant[];
  }>("/intervenants");
  return response.data || [];
}

/**
 * Récupérer un intervenant par son ID
 */
export async function getIntervenantById(id: string): Promise<Intervenant> {
  const response = await apiClient.get<{ success: boolean; data: Intervenant }>(
    `/intervenants/${id}`
  );
  return response.data || (response as unknown as Intervenant);
}

/**
 * Mettre à jour un intervenant
 */
export async function updateIntervenant(
  id: string,
  data: Partial<{
    bio: string;
    siret: string;
    disponibility: boolean;
  }>
): Promise<Intervenant> {
  const response = await apiClient.patch<{
    success: boolean;
    data: Intervenant;
  }>(`/intervenants/${id}`, data);
  return response.data || (response as unknown as Intervenant);
}

/**
 * Mettre à jour le statut d'un intervenant
 */
export async function updateIntervenantStatus(
  id: string,
  status: string
): Promise<Intervenant> {
  const response = await apiClient.patch<{
    success: boolean;
    data: Intervenant;
  }>(`/intervenants/${id}/status`, { status });
  return response.data || (response as unknown as Intervenant);
}

/**
 * Récupérer les documents d'un intervenant
 */
export async function getIntervenantDocuments(
  intervenantId: string
): Promise<unknown[]> {
  const response = await apiClient.get<{ success: boolean; data: unknown[] }>(
    `/intervenants/${intervenantId}/documents`
  );
  return response.data || [];
}

/**
 * Uploader un document pour un intervenant
 */
export async function uploadDocument(
  intervenantId: string,
  file: File,
  type: string
): Promise<unknown> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  const response = await apiClient.post<{ success: boolean; data: unknown }>(
    `/intervenants/${intervenantId}/documents`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data || response;
}

/**
 * Supprimer un document
 */
export async function deleteDocument(
  intervenantId: string,
  documentId: string
): Promise<void> {
  await apiClient.delete(
    `/intervenants/${intervenantId}/documents/${documentId}`
  );
}
