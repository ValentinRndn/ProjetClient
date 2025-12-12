/**
 * ============================================
 * Vizion Academy - Service Tracking
 * Suivi des consultations de profils
 * ============================================
 */

import api from "./api";

export interface Consultation {
  id: string;
  intervenantId: string;
  ecoleId: string | null;
  userId: string | null;
  source: "profil" | "liste" | "recherche" | "mission";
  duration: number | null;
  ipAddress: string | null;
  userAgent: string | null;
  referer: string | null;
  createdAt: string;
  intervenant?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    profileImage: string | null;
  };
  ecole?: {
    id: string;
    name: string;
  } | null;
}

export interface TrackingStats {
  total: number;
  last30Days: number;
  last7Days: number;
  bySource: { source: string; count: number }[];
  topEcoles?: { ecoleId: string; ecoleName: string; count: number }[];
  topIntervenants?: { intervenantId: string; intervenantName: string; count: number }[];
  dailyStats: { date: string; count: number }[];
  uniqueVisitors?: number;
}

export interface ConsultationsResponse {
  success: boolean;
  data: Consultation[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TrackingQueryParams {
  intervenantId?: string;
  ecoleId?: string;
  startDate?: string;
  endDate?: string;
  source?: string;
  page?: number;
  limit?: number;
}

/**
 * Enregistre une consultation de profil
 */
export async function trackConsultation(
  intervenantId: string,
  source: "profil" | "liste" | "recherche" | "mission" = "profil",
  duration?: number
): Promise<{ success: boolean; data: { id: string } }> {
  const response = await api.post("/tracking/consultation", {
    intervenantId,
    source,
    duration,
  });
  return response.data;
}

/**
 * Récupère la liste des consultations
 */
export async function getConsultations(
  params: TrackingQueryParams = {}
): Promise<ConsultationsResponse> {
  const searchParams = new URLSearchParams();
  if (params.intervenantId) searchParams.append("intervenantId", params.intervenantId);
  if (params.ecoleId) searchParams.append("ecoleId", params.ecoleId);
  if (params.startDate) searchParams.append("startDate", params.startDate);
  if (params.endDate) searchParams.append("endDate", params.endDate);
  if (params.source) searchParams.append("source", params.source);
  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());

  const query = searchParams.toString();
  const response = await api.get(`/tracking/consultations${query ? `?${query}` : ""}`);
  return response.data;
}

/**
 * Récupère les stats d'un intervenant
 */
export async function getIntervenantStats(
  intervenantId: string
): Promise<{ success: boolean; data: TrackingStats }> {
  const response = await api.get(`/tracking/stats/intervenant/${intervenantId}`);
  return response.data;
}

/**
 * Récupère les stats globales (admin)
 */
export async function getGlobalStats(): Promise<{ success: boolean; data: TrackingStats }> {
  const response = await api.get("/tracking/stats/global");
  return response.data;
}

/**
 * Exporte les consultations en CSV
 */
export async function exportConsultationsCSV(
  params: TrackingQueryParams = {}
): Promise<void> {
  const searchParams = new URLSearchParams();
  if (params.intervenantId) searchParams.append("intervenantId", params.intervenantId);
  if (params.ecoleId) searchParams.append("ecoleId", params.ecoleId);
  if (params.startDate) searchParams.append("startDate", params.startDate);
  if (params.endDate) searchParams.append("endDate", params.endDate);
  if (params.source) searchParams.append("source", params.source);

  const query = searchParams.toString();
  const response = await api.get(`/tracking/export${query ? `?${query}` : ""}`, {
    responseType: "blob",
  });

  // Télécharger le fichier
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `consultations-${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

/**
 * Helper pour le tracking automatique lors de la visite d'un profil
 */
let currentPageVisit: { intervenantId: string; startTime: number } | null = null;

export function startTracking(intervenantId: string): void {
  currentPageVisit = {
    intervenantId,
    startTime: Date.now(),
  };
}

export function endTracking(): void {
  if (currentPageVisit) {
    const duration = Math.round((Date.now() - currentPageVisit.startTime) / 1000);
    // Envoyer le tracking uniquement si la visite a duré plus de 2 secondes
    if (duration >= 2) {
      trackConsultation(currentPageVisit.intervenantId, "profil", duration).catch(console.error);
    }
    currentPageVisit = null;
  }
}

/**
 * Hook custom pour tracker automatiquement la durée de visite
 */
export function useTrackingOnUnmount(intervenantId: string): void {
  startTracking(intervenantId);

  // Cleanup automatique au démontage du composant
  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", endTracking);
  }
}
