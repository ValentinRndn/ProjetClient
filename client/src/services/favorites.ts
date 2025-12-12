/**
 * Service de gestion des favoris (écoles uniquement)
 */

import api from "@/lib/api";

export interface Favorite {
  id: string;
  ecoleId: string;
  intervenantId: string;
  note?: string;
  createdAt: string;
  intervenant: {
    id: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    expertises?: string[];
    city?: string;
    yearsExperience?: number;
    profileImage?: string;
    status: string;
    user?: {
      id: string;
      email: string;
      name?: string;
    };
    documents?: Array<{
      id: string;
      type: string;
      fileName: string;
      filePath: string;
    }>;
  };
}

export interface FavoritesResponse {
  success: boolean;
  data: Favorite[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AddFavoriteResponse {
  success: boolean;
  message: string;
  data: Favorite;
}

export interface CheckFavoriteResponse {
  success: boolean;
  isFavorite: boolean;
  data?: Favorite;
}

/**
 * Récupérer tous les favoris de l'école connectée
 */
export async function getMyFavorites(
  page = 1,
  limit = 20
): Promise<FavoritesResponse> {
  // L'intercepteur retourne directement response.data
  return api.get(`/favorites?page=${page}&limit=${limit}`);
}

/**
 * Ajouter un intervenant aux favoris
 */
export async function addFavorite(
  intervenantId: string,
  note?: string
): Promise<AddFavoriteResponse> {
  return api.post("/favorites", {
    intervenantId,
    note,
  });
}

/**
 * Vérifier si un intervenant est dans les favoris
 */
export async function checkFavorite(
  intervenantId: string
): Promise<CheckFavoriteResponse> {
  return api.get(`/favorites/check/${intervenantId}`);
}

/**
 * Mettre à jour la note d'un favori
 */
export async function updateFavoriteNote(
  intervenantId: string,
  note: string
): Promise<{ success: boolean; data: Favorite }> {
  return api.patch(`/favorites/${intervenantId}`, { note });
}

/**
 * Supprimer un intervenant des favoris
 */
export async function removeFavorite(
  intervenantId: string
): Promise<{ success: boolean; message: string }> {
  return api.delete(`/favorites/${intervenantId}`);
}

/**
 * Toggle favori (ajouter ou supprimer)
 */
export async function toggleFavorite(
  intervenantId: string,
  note?: string
): Promise<{ isFavorite: boolean }> {
  const checkResponse = await checkFavorite(intervenantId);

  if (checkResponse.isFavorite) {
    await removeFavorite(intervenantId);
    return { isFavorite: false };
  } else {
    await addFavorite(intervenantId, note);
    return { isFavorite: true };
  }
}
