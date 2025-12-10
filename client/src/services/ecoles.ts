/**
 * Service des écoles
 * Gère toutes les opérations liées aux écoles
 */

import apiClient from "@/lib/api";

export interface Ecole {
  id: string;
  name: string;
  contactEmail?: string;
  address?: string;
  phone?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EcoleDashboard {
  ecole: {
    id: string;
    name: string;
    contactEmail?: string;
  };
  totalMissions: number;
  missionsByStatus: {
    DRAFT?: number;
    ACTIVE?: number;
    COMPLETED?: number;
  };
  recentMissions: unknown[];
}

/**
 * Liste publique des écoles (pour filtres)
 */
export async function getPublicEcoles(): Promise<Ecole[]> {
  const response = await apiClient.get<{ success: boolean; data: Ecole[] }>(
    "/ecoles/public"
  );
  return response.data || [];
}

/**
 * Liste toutes les écoles (ADMIN only)
 */
export async function getAllEcoles(): Promise<Ecole[]> {
  const response = await apiClient.get<{ success: boolean; data: Ecole[] }>(
    "/ecoles"
  );
  return response.data || [];
}

/**
 * Récupérer une école par son ID
 */
export async function getEcoleById(id: string): Promise<Ecole> {
  const response = await apiClient.get<{ success: boolean; data: Ecole }>(
    `/ecoles/${id}`
  );
  return response.data || (response as unknown as Ecole);
}

/**
 * Créer une nouvelle école
 */
export async function createEcole(data: {
  name: string;
  contactEmail?: string;
  address?: string;
  phone?: string;
}): Promise<Ecole> {
  const response = await apiClient.post<{ success: boolean; data: Ecole }>(
    "/ecoles",
    data
  );
  return response.data || (response as unknown as Ecole);
}

/**
 * Mettre à jour une école
 */
export async function updateEcole(
  id: string,
  data: Partial<{
    name: string;
    contactEmail: string;
    address: string;
    phone: string;
  }>
): Promise<Ecole> {
  const response = await apiClient.patch<{ success: boolean; data: Ecole }>(
    `/ecoles/${id}`,
    data
  );
  return response.data || (response as unknown as Ecole);
}

/**
 * Supprimer une école
 */
export async function deleteEcole(id: string): Promise<void> {
  await apiClient.delete(`/ecoles/${id}`);
}

/**
 * Récupérer le dashboard d'une école
 */
export async function getEcoleDashboard(id: string): Promise<EcoleDashboard> {
  const response = await apiClient.get<{
    success: boolean;
    data: EcoleDashboard;
  }>(`/ecoles/${id}/dashboard`);
  return response.data || (response as unknown as EcoleDashboard);
}

/**
 * Déclarer une nouvelle mission pour l'école
 */
export async function declareMission(
  ecoleId: string,
  missionData: {
    title: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    priceCents?: number;
    status?: string;
  }
): Promise<unknown> {
  const response = await apiClient.post<{ success: boolean; data: unknown }>(
    `/ecoles/${ecoleId}/declare-mission`,
    missionData
  );
  return response.data || response;
}
