/**
 * Service de gestion des Challenges pédagogiques
 * - Seuls les admins peuvent créer/modifier/supprimer
 * - Système de brouillon (draft) / publié (published)
 */

import api from "@/lib/api";

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
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
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
  status?: "draft" | "published";
}

export interface ChallengeStats {
  total: number;
  draft: number;
  published: number;
}

// ============================================
// Routes publiques
// ============================================

/**
 * Récupérer tous les challenges publiés (public)
 */
export async function getPublicChallenges(thematique?: string): Promise<Challenge[]> {
  const params = thematique ? `?thematique=${encodeURIComponent(thematique)}` : "";
  const response = await api.get(`/challenges/public${params}`);
  // L'API retourne directement un tableau, pas un objet {success, data}
  // L'intercepteur axios retourne response quand pas de success
  return response.data || response;
}

/**
 * Récupérer un challenge publié par ID (public)
 */
export async function getPublicChallengeById(id: string): Promise<Challenge> {
  const response = await api.get(`/challenges/public/${id}`);
  return response.data;
}

// ============================================
// Routes Admin uniquement
// ============================================

/**
 * Créer un nouveau challenge (admin)
 */
export async function createChallenge(data: CreateChallengeData): Promise<Challenge> {
  const response = await api.post("/challenges/admin", data);
  return response.data;
}

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
 * Récupérer un challenge par ID (admin)
 */
export async function getChallengeById(id: string): Promise<Challenge> {
  const response = await api.get(`/challenges/admin/${id}`);
  return response.data;
}

/**
 * Mettre à jour un challenge (admin)
 */
export async function updateChallenge(
  id: string,
  data: Partial<CreateChallengeData>
): Promise<Challenge> {
  const response = await api.put(`/challenges/admin/${id}`, data);
  return response.data;
}

/**
 * Supprimer un challenge (admin)
 */
export async function deleteChallenge(id: string): Promise<void> {
  await api.delete(`/challenges/admin/${id}`);
}

/**
 * Statistiques des challenges (admin)
 */
export async function getChallengeStats(): Promise<ChallengeStats> {
  const response = await api.get("/challenges/admin/stats");
  return response.data;
}

/**
 * Publier un challenge (admin)
 */
export async function publishChallenge(id: string): Promise<Challenge> {
  const response = await api.post(`/challenges/admin/${id}/publish`);
  return response.data;
}

/**
 * Dépublier un challenge (passer en brouillon) (admin)
 */
export async function unpublishChallenge(id: string): Promise<Challenge> {
  const response = await api.post(`/challenges/admin/${id}/unpublish`);
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

export type Thematique = (typeof THEMATIQUES)[number];
