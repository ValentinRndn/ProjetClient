/**
 * ============================================
 * Vizion Academy - Service Factures
 * Gestion des factures frontend
 * ============================================
 */

import api from "./api";

export interface LigneFacture {
  description: string;
  quantite: number;
  prixUnitaire: number;
  total: number;
}

export interface Facture {
  id: string;
  numero: string;
  type: "ecole" | "intervenant";
  emetteurType: string;
  emetteurId: string | null;
  destinataireType: string;
  destinataireId: string;
  missionId: string | null;
  mission?: {
    id: string;
    title: string;
    status: string;
    ecole?: { id: string; name: string };
    intervenant?: {
      id: string;
      firstName: string;
      lastName: string;
      user: { email: string };
    };
  };
  montantHT: number;
  tva: number;
  montantTTC: number;
  fraisService: number;
  status: "brouillon" | "envoyee" | "payee" | "annulee" | "en_retard";
  dateEmission: string | null;
  dateEcheance: string | null;
  datePaiement: string | null;
  modePaiement: string | null;
  reference: string | null;
  description: string | null;
  lignes: LigneFacture[] | null;
  notes: string | null;
  pdfPath: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFactureData {
  type: "ecole" | "intervenant";
  destinataireId: string;
  missionId?: string;
  montantHT: number;
  tva?: number;
  description?: string;
  lignes?: LigneFacture[];
  notes?: string;
  dateEcheance?: string;
}

export interface UpdateFactureData {
  status?: "brouillon" | "envoyee" | "payee" | "annulee" | "en_retard";
  datePaiement?: string;
  modePaiement?: string;
  reference?: string;
  notes?: string;
}

export interface FacturesListResponse {
  success: boolean;
  data: Facture[];
  totaux: {
    montantHT: number;
    montantTTC: number;
  };
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface FacturesQueryParams {
  type?: "ecole" | "intervenant";
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

/**
 * Récupère la liste des factures avec filtres
 */
export async function getFactures(
  params: FacturesQueryParams = {}
): Promise<FacturesListResponse> {
  const searchParams = new URLSearchParams();
  if (params.type) searchParams.append("type", params.type);
  if (params.status) searchParams.append("status", params.status);
  if (params.startDate) searchParams.append("startDate", params.startDate);
  if (params.endDate) searchParams.append("endDate", params.endDate);
  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());

  const query = searchParams.toString();
  const response = await api.get(`/factures${query ? `?${query}` : ""}`);
  return response.data;
}

/**
 * Récupère une facture par son ID
 */
export async function getFacture(id: string): Promise<{ success: boolean; data: Facture }> {
  const response = await api.get(`/factures/${id}`);
  return response.data;
}

/**
 * Crée une nouvelle facture
 */
export async function createFacture(
  data: CreateFactureData
): Promise<{ success: boolean; message: string; data: Facture }> {
  const response = await api.post("/factures", data);
  return response.data;
}

/**
 * Met à jour une facture
 */
export async function updateFacture(
  id: string,
  data: UpdateFactureData
): Promise<{ success: boolean; message: string; data: Facture }> {
  const response = await api.patch(`/factures/${id}`, data);
  return response.data;
}

/**
 * Supprime une facture (brouillon uniquement)
 */
export async function deleteFacture(
  id: string
): Promise<{ success: boolean; message: string }> {
  const response = await api.delete(`/factures/${id}`);
  return response.data;
}

/**
 * Envoie une facture (change le statut à "envoyee")
 */
export async function envoyerFacture(
  id: string
): Promise<{ success: boolean; message: string; data: Facture }> {
  const response = await api.post(`/factures/${id}/envoyer`);
  return response.data;
}

/**
 * Marque une facture comme payée
 */
export async function marquerPayee(
  id: string,
  data?: { modePaiement?: string; reference?: string }
): Promise<{ success: boolean; message: string; data: Facture }> {
  const response = await api.post(`/factures/${id}/marquer-payee`, data || {});
  return response.data;
}

/**
 * Formate un montant en centimes en euros
 */
export function formatMontant(centimes: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(centimes / 100);
}

/**
 * Retourne le libellé du statut
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    brouillon: "Brouillon",
    envoyee: "Envoyée",
    payee: "Payée",
    annulee: "Annulée",
    en_retard: "En retard",
  };
  return labels[status] || status;
}

/**
 * Retourne la couleur du statut
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    brouillon: "bg-gray-100 text-gray-800",
    envoyee: "bg-blue-100 text-blue-800",
    payee: "bg-green-100 text-green-800",
    annulee: "bg-red-100 text-red-800",
    en_retard: "bg-orange-100 text-orange-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

/**
 * Génère le PDF d'une facture
 */
export async function genererPDF(
  id: string
): Promise<{ success: boolean; message: string; data: { pdfPath: string } }> {
  const response = await api.post(`/factures/${id}/generer-pdf`);
  return response.data;
}

/**
 * Télécharge le PDF d'une facture
 */
export async function telechargerPDF(id: string, numero: string): Promise<void> {
  const response = await api.get(`/factures/${id}/pdf`, {
    responseType: "blob",
  });

  // Créer un lien de téléchargement
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `Facture-${numero}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

/**
 * Prévisualise le PDF d'une facture dans un nouvel onglet
 */
export function previewPDF(id: string): void {
  const baseUrl = api.defaults.baseURL || "";
  window.open(`${baseUrl}/factures/${id}/preview-pdf`, "_blank");
}
