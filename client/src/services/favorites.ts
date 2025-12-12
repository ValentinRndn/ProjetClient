/**
 * Service de gestion des favoris (écoles uniquement)
 */

import api from "./api";

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
  const response = await api.get<FavoritesResponse>(
    `/favorites?page=${page}&limit=${limit}`
  );
  return response.data;
}

/**
 * Ajouter un intervenant aux favoris
 */
export async function addFavorite(
  intervenantId: string,
  note?: string
): Promise<AddFavoriteResponse> {
  const response = await api.post<AddFavoriteResponse>("/favorites", {
    intervenantId,
    note,
  });
  return response.data;
}

/**
 * Vérifier si un intervenant est dans les favoris
 */
export async function checkFavorite(
  intervenantId: string
): Promise<CheckFavoriteResponse> {
  const response = await api.get<CheckFavoriteResponse>(
    `/favorites/check/${intervenantId}`
  );
  return response.data;
}

/**
 * Mettre à jour la note d'un favori
 */
export async function updateFavoriteNote(
  intervenantId: string,
  note: string
): Promise<{ success: boolean; data: Favorite }> {
  const response = await api.patch<{ success: boolean; data: Favorite }>(
    `/favorites/${intervenantId}`,
    { note }
  );
  return response.data;
}

/**
 * Supprimer un intervenant des favoris
 */
export async function removeFavorite(
  intervenantId: string
): Promise<{ success: boolean; message: string }> {
  const response = await api.delete<{ success: boolean; message: string }>(
    `/favorites/${intervenantId}`
  );
  return response.data;
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
