/**
 * Service des missions
 * Gère toutes les opérations liées aux missions
 */

import apiClient from "@/lib/api";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api/v1";

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
 * Liste publique des missions actives (sans authentification)
 */
export async function getPublicMissions(
  filters: { q?: string; take?: number; skip?: number } = {}
): Promise<MissionListResponse> {
  const params = new URLSearchParams();

  if (filters.take) params.append("take", filters.take.toString());
  if (filters.skip) params.append("skip", filters.skip.toString());
  if (filters.q) params.append("q", filters.q);

  const queryString = params.toString();
  const url = `${API_BASE_URL}/missions/public${queryString ? `?${queryString}` : ""}`;

  // Utiliser axios directement sans authentification
  const response = await axios.get<MissionListResponse>(url);
  return response.data;
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
 * Postuler à une mission (pour les intervenants) - crée une candidature
 */
export async function applyToMission(
  missionId: string,
  data?: { message?: string; tarifPropose?: number }
): Promise<Candidature> {
  const response = await apiClient.post<{ success: boolean; data: Candidature; message: string }>(
    `/missions/${missionId}/apply`,
    data || {}
  );
  return response.data || (response as unknown as Candidature);
}

// ============================================
// Types et fonctions pour les candidatures
// ============================================

export type CandidatureStatus = "en_attente" | "acceptee" | "refusee" | "retiree";

export interface Candidature {
  id: string;
  missionId: string;
  intervenantId: string;
  message?: string;
  tarifPropose?: number;
  status: CandidatureStatus;
  createdAt: string;
  updatedAt: string;
  mission?: {
    id: string;
    title: string;
    description?: string;
    status: MissionStatus;
    priceCents?: number;
    startDate?: string;
    endDate?: string;
    ecole?: {
      id: string;
      name: string;
    };
  };
  intervenant?: {
    id: string;
    firstName?: string;
    lastName?: string;
    profileImage?: string;
    bio?: string;
    expertises?: string[];
    city?: string;
    yearsExperience?: number;
    user?: {
      email: string;
    };
  };
}

/**
 * Récupère les candidatures d'une mission (pour l'école propriétaire)
 */
export async function getMissionCandidatures(missionId: string): Promise<Candidature[]> {
  const response = await apiClient.get<{ success: boolean; data: Candidature[] }>(
    `/missions/${missionId}/candidatures`
  );
  return response.data || (response as unknown as Candidature[]);
}

/**
 * Accepte une candidature (assigne l'intervenant à la mission)
 */
export async function acceptCandidature(candidatureId: string): Promise<Mission> {
  const response = await apiClient.post<{ success: boolean; data: Mission; message: string }>(
    `/missions/candidatures/${candidatureId}/accept`
  );
  return response.data || (response as unknown as Mission);
}

/**
 * Refuse une candidature
 */
export async function rejectCandidature(candidatureId: string): Promise<Candidature> {
  const response = await apiClient.post<{ success: boolean; data: Candidature; message: string }>(
    `/missions/candidatures/${candidatureId}/reject`
  );
  return response.data || (response as unknown as Candidature);
}

/**
 * Retire une candidature (pour l'intervenant)
 */
export async function withdrawCandidature(candidatureId: string): Promise<Candidature> {
  const response = await apiClient.post<{ success: boolean; data: Candidature; message: string }>(
    `/missions/candidatures/${candidatureId}/withdraw`
  );
  return response.data || (response as unknown as Candidature);
}

/**
 * Récupère toutes les candidatures de l'intervenant connecté
 */
export async function getMyCandidatures(): Promise<Candidature[]> {
  const response = await apiClient.get<{ success: boolean; data: Candidature[] }>(
    `/missions/candidatures/mes-candidatures`
  );
  return response.data || (response as unknown as Candidature[]);
}
