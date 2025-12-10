/**
 * Service des utilisateurs
 * Gère toutes les opérations liées aux utilisateurs (ADMIN only)
 */

import apiClient from "@/lib/api";
import type { User } from "./auth";

/**
 * Liste tous les utilisateurs (ADMIN only)
 */
export async function getAllUsers(): Promise<User[]> {
  const response = await apiClient.get<{ success: boolean; data: User[] }>(
    "/users"
  );
  return response.data || [];
}

/**
 * Récupérer un utilisateur par son ID
 */
export async function getUserById(id: string): Promise<User> {
  const response = await apiClient.get<{ success: boolean; data: User }>(
    `/users/${id}`
  );
  return response.data || (response as unknown as User);
}

/**
 * Créer un nouvel utilisateur
 */
export async function createUser(data: {
  email: string;
  password: string;
  role: string;
  name?: string;
}): Promise<User> {
  const response = await apiClient.post<{ success: boolean; data: User }>(
    "/users",
    data
  );
  return response.data || (response as unknown as User);
}

/**
 * Mettre à jour un utilisateur
 */
export async function updateUser(
  id: string,
  data: Partial<{
    email: string;
    name: string;
    role: string;
  }>
): Promise<User> {
  const response = await apiClient.patch<{ success: boolean; data: User }>(
    `/users/${id}`,
    data
  );
  return response.data || (response as unknown as User);
}

/**
 * Supprimer un utilisateur
 */
export async function deleteUser(id: string): Promise<void> {
  await apiClient.delete(`/users/${id}`);
}

/**
 * Mettre à jour le rôle d'un utilisateur
 */
export async function updateUserRole(id: string, role: string): Promise<User> {
  return updateUser(id, { role });
}
