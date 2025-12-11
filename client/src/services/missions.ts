/**
 * Service des missions
 * Gère toutes les opérations liées aux missions
 */

import apiClient from "@/lib/api";

export type MissionStatus = "DRAFT" | "ACTIVE" | "COMPLETED";

export interface Mission {
  id: string;
  title: string;
  description?: string;
  status: MissionStatus;
  startDate?: string;
  endDate?: string;
  priceCents?: number;
  ecole?: {
    id: string;
    name: string;
  };
  intervenant?: {
    id: string;
    bio?: string;
    user?: {
      email: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface MissionFilters {
  ecoleId?: string;
  intervenantId?: string;
  status?: MissionStatus;
  q?: string;
  take?: number;
  skip?: number;
}

export interface MissionListResponse {
  success: boolean;
  items: Mission[];
  total?: number;
}

/**
 * Liste toutes les missions avec filtres optionnels
 */
export async function getAllMissions(
  filters: MissionFilters = {}
): Promise<MissionListResponse> {
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

  const response = await apiClient.get<MissionListResponse>(url);
  return response;
}

/**
 * Liste les missions de l'école connectée
 */
export async function getMyEcoleMissions(): Promise<MissionListResponse> {
  const response = await apiClient.get<MissionListResponse>("/missions/ecole");
  return response;
}

/**
 * Liste les missions de l'intervenant connecté
 */
export async function getMyIntervenantMissions(): Promise<MissionListResponse> {
  const response = await apiClient.get<MissionListResponse>(
    "/missions/intervenant"
  );
  return response;
}

/**
 * Récupérer une mission par son ID
 */
export async function getMissionById(id: string): Promise<Mission> {
  const response = await apiClient.get<{ success: boolean; data: Mission }>(
    `/missions/${id}`
  );
  return response.data || (response as unknown as Mission);
}

/**
 * Créer une nouvelle mission
 */
export async function createMission(data: {
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  priceCents?: number;
  status?: MissionStatus;
}): Promise<Mission> {
  const response = await apiClient.post<{ success: boolean; data: Mission }>(
    "/missions",
    data
  );
  return response.data || (response as unknown as Mission);
}

/**
 * Mettre à jour une mission
 */
export async function updateMission(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    status: MissionStatus;
    startDate: string;
    endDate: string;
    priceCents: number;
  }>
): Promise<Mission> {
  const response = await apiClient.patch<{ success: boolean; data: Mission }>(
    `/missions/${id}`,
    data
  );
  return response.data || (response as unknown as Mission);
}

/**
 * Mettre à jour le statut d'une mission
 */
export async function updateMissionStatus(
  id: string,
  status: MissionStatus
): Promise<Mission> {
  return updateMission(id, { status });
}

/**
 * Assigner un intervenant à une mission
 */
export async function assignIntervenant(
  missionId: string,
  intervenantId: string
): Promise<Mission> {
  const response = await apiClient.patch<{ success: boolean; data: Mission }>(
    `/missions/${missionId}/assign`,
    { intervenantId }
  );
  return response.data || (response as unknown as Mission);
}

/**
 * Supprimer une mission
 */
export async function deleteMission(id: string): Promise<void> {
  await apiClient.delete(`/missions/${id}`);
}

/**
 * Postuler à une mission (pour les intervenants)
 */
export async function applyToMission(missionId: string): Promise<Mission> {
  const response = await apiClient.post<{ success: boolean; data: Mission; message: string }>(
    `/missions/${missionId}/apply`
  );
  return response.data || (response as unknown as Mission);
}
