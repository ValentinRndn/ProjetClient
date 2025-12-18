/**
 * Service admin
 * Gère toutes les opérations liées à l'administration
 */

import apiClient from "@/lib/api";
import { Intervenant } from "./intervenants";

export interface AdminStats {
  totalUsers: number;
  totalIntervenants: number;
  totalEcoles: number;
  pendingIntervenants: number;
  approvedIntervenants: number;
  rejectedIntervenants: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: "ADMIN" | "ECOLE" | "INTERVENANT";
  createdAt: string;
}

export interface UsersListResponse {
  total: number;
  items: User[];
}

/**
 * Récupérer les statistiques du dashboard admin
 */
export async function getAdminStats(): Promise<AdminStats> {
  const response = await apiClient.get<{
    success: boolean;
    data: AdminStats;
  }>("/admin/stats");
  return response.data || ({} as AdminStats);
}

/**
 * Lister les utilisateurs (avec pagination et filtres)
 */
export async function listUsers(filters?: {
  take?: number;
  skip?: number;
  q?: string;
  role?: string;
}): Promise<UsersListResponse> {
  const params = new URLSearchParams();
  if (filters?.take) params.append("take", filters.take.toString());
  if (filters?.skip) params.append("skip", filters.skip.toString());
  if (filters?.q) params.append("q", filters.q);
  if (filters?.role) params.append("role", filters.role);

  const url = `/admin/users${params.toString() ? `?${params.toString()}` : ""}`;
  const response = await apiClient.get<{
    success: boolean;
    data: UsersListResponse;
  }>(url);

  if (response && typeof response === "object" && "data" in response) {
    return response.data;
  }

  return { total: 0, items: [] };
}

/**
 * Valider un intervenant (approuver ou rejeter)
 */
export async function validateIntervenant(
  id: string,
  status: "approved" | "rejected",
  reason?: string
): Promise<Intervenant> {
  const response = await apiClient.post<{
    success: boolean;
    data: Intervenant;
  }>(`/admin/intervenants/${id}/validate`, { status, reason });
  return response.data || (response as unknown as Intervenant);
}

/**
 * Supprimer un intervenant (et son utilisateur associé)
 */
export async function deleteIntervenant(id: string): Promise<void> {
  await apiClient.delete(`/intervenants/${id}`);
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
export async function updateUserRole(
  id: string,
  role: "ADMIN" | "ECOLE" | "INTERVENANT"
): Promise<User> {
  const response = await apiClient.patch<{
    success: boolean;
    data: User;
  }>(`/users/${id}/role`, { role });
  return response.data || (response as unknown as User);
}
