/**
 * Service de gestion des Challenges pédagogiques
 */

import api from "./api";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  thematique: string;
  duration?: string;
  targetAudience?: string;
  objectives: string[];
  deliverables: string[];
  prerequisites?: string;
  imageUrl?: string;
  videoUrl?: string;
  priceCents?: number;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  intervenantId: string;
  intervenant?: {
    id: string;
    firstName?: string;
    lastName?: string;
    profileImage?: string;
    city?: string;
    bio?: string;
    expertises?: string[];
    user?: { email: string };
  };
}

export interface CreateChallengeData {
  title: string;
  description: string;
  shortDescription?: string;
  thematique: string;
  duration?: string;
  targetAudience?: string;
  objectives?: string[];
  deliverables?: string[];
  prerequisites?: string;
  imageUrl?: string;
  videoUrl?: string;
  priceCents?: number;
}

export interface ChallengeStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

// ============================================
// Routes publiques
// ============================================

/**
 * Récupérer tous les challenges approuvés (public)
 */
export async function getPublicChallenges(thematique?: string): Promise<Challenge[]> {
  const params = thematique ? `?thematique=${encodeURIComponent(thematique)}` : "";
  const response = await api.get(`/challenges/public${params}`);
  return response.data;
}

/**
 * Récupérer un challenge approuvé par ID (public)
 */
export async function getPublicChallengeById(id: string): Promise<Challenge> {
  const response = await api.get(`/challenges/public/${id}`);
  return response.data;
}

// ============================================
// Routes authentifiées (Intervenants)
// ============================================

/**
 * Créer un nouveau challenge (intervenant)
 */
export async function createChallenge(data: CreateChallengeData): Promise<Challenge> {
  const response = await api.post("/challenges", data);
  return response.data;
}

/**
 * Récupérer mes challenges (intervenant)
 */
export async function getMyChallenges(): Promise<Challenge[]> {
  const response = await api.get("/challenges/my");
  return response.data;
}

/**
 * Récupérer un challenge par ID (authentifié)
 */
export async function getChallengeById(id: string): Promise<Challenge> {
  const response = await api.get(`/challenges/${id}`);
  return response.data;
}

/**
 * Mettre à jour un challenge
 */
export async function updateChallenge(
  id: string,
  data: Partial<CreateChallengeData>
): Promise<Challenge> {
  const response = await api.put(`/challenges/${id}`, data);
  return response.data;
}

/**
 * Supprimer un challenge
 */
export async function deleteChallenge(id: string): Promise<void> {
  await api.delete(`/challenges/${id}`);
}

// ============================================
// Routes Admin
// ============================================

/**
 * Récupérer tous les challenges (admin)
 */
export async function getAllChallenges(filters?: {
  status?: string;
  thematique?: string;
}): Promise<Challenge[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.append("status", filters.status);
  if (filters?.thematique) params.append("thematique", filters.thematique);
  const query = params.toString() ? `?${params.toString()}` : "";
  const response = await api.get(`/challenges/admin/all${query}`);
  return response.data;
}

/**
 * Statistiques des challenges (admin)
 */
export async function getChallengeStats(): Promise<ChallengeStats> {
  const response = await api.get("/challenges/admin/stats");
  return response.data;
}

/**
 * Approuver un challenge (admin)
 */
export async function approveChallenge(id: string): Promise<Challenge> {
  const response = await api.post(`/challenges/admin/${id}/approve`);
  return response.data;
}

/**
 * Rejeter un challenge (admin)
 */
export async function rejectChallenge(id: string, reason?: string): Promise<Challenge> {
  const response = await api.post(`/challenges/admin/${id}/reject`, { reason });
  return response.data;
}

// Liste des thématiques disponibles
export const THEMATIQUES = [
  "Marketing",
  "Intelligences artificielles",
  "RSE",
  "Communication",
  "Entrepreneuriat",
  "Digital",
  "Créativité",
  "Art",
  "Langues étrangères",
  "Finance",
] as const;

export type Thematique = typeof THEMATIQUES[number];
