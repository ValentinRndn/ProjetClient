/**
 * Service des intervenants
 * Gère toutes les opérations liées aux intervenants
 */

import apiClient from "@/lib/api";

export interface Intervenant {
  id: string;
  bio?: string;
  siret?: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  disponibility?: boolean | object;
  status?: string;
  userId?: string;
  // Nouveaux champs pour profil enrichi
  expertises?: string[];
  videoUrl?: string;
  linkedinUrl?: string;
  website?: string;
  phone?: string;
  city?: string;
  yearsExperience?: number;
  user?: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
  documents?: Document[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Liste tous les intervenants
 * @param filters - Filtres optionnels (status, take, skip)
 */
export async function getAllIntervenants(filters?: {
  status?: string;
  take?: number;
  skip?: number;
}): Promise<Intervenant[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.append("status", filters.status);
  if (filters?.take) params.append("take", filters.take.toString());
  if (filters?.skip) params.append("skip", filters.skip.toString());

  const url = `/intervenants${
    params.toString() ? `?${params.toString()}` : ""
  }`;
  const response = await apiClient.get<{
    success: boolean;
    data: Intervenant[];
  }>(url);

  // L'apiClient transforme la réponse: si l'API retourne { success: true, data: [...] }
  // alors response est { success: true, data: [...] }, donc response.data est le tableau
  if (
    response &&
    typeof response === "object" &&
    "data" in response &&
    Array.isArray(response.data)
  ) {
    return response.data;
  }

  // Fallback si la structure est différente
  if (Array.isArray(response)) {
    return response;
  }

  return [];
}

/**
 * Récupérer un intervenant par son ID (authentifié)
 */
export async function getIntervenantById(id: string): Promise<Intervenant> {
  const response = await apiClient.get<{ success: boolean; data: Intervenant }>(
    `/intervenants/${id}`
  );
  return response.data || (response as unknown as Intervenant);
}

/**
 * Récupérer le profil public d'un intervenant (sans authentification)
 */
export async function getPublicIntervenantById(id: string): Promise<Intervenant> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api/v1";
  const response = await fetch(`${baseUrl}/intervenants/public/${id}`);

  if (!response.ok) {
    throw new Error("Intervenant non trouvé");
  }

  const data = await response.json();
  return data.data || data;
}

export interface UpdateIntervenantData {
  // Informations personnelles
  firstName?: string;
  lastName?: string;
  bio?: string;
  phone?: string;
  city?: string;

  // Informations professionnelles
  siret?: string;
  yearsExperience?: number | null;
  expertises?: string[];

  // Liens et médias
  videoUrl?: string;
  linkedinUrl?: string;
  website?: string;
  profileImage?: string;

  // Disponibilités
  disponibility?: boolean | object;
}

/**
 * Mettre à jour un intervenant
 */
export async function updateIntervenant(
  id: string,
  data: UpdateIntervenantData
): Promise<Intervenant> {
  const response = await apiClient.patch<{
    success: boolean;
    data: Intervenant;
  }>(`/intervenants/${id}`, data);
  return response.data || (response as unknown as Intervenant);
}

/**
 * Mettre à jour le statut d'un intervenant
 */
export async function updateIntervenantStatus(
  id: string,
  status: string
): Promise<Intervenant> {
  const response = await apiClient.patch<{
    success: boolean;
    data: Intervenant;
  }>(`/intervenants/${id}/status`, { status });
  return response.data || (response as unknown as Intervenant);
}

/**
 * Récupérer les documents d'un intervenant
 */
export async function getIntervenantDocuments(
  intervenantId: string
): Promise<unknown[]> {
  const response = await apiClient.get<{ success: boolean; data: unknown[] }>(
    `/intervenants/${intervenantId}/documents`
  );
  return response.data || [];
}

/**
 * Uploader un document pour un intervenant
 */
export async function uploadDocument(
  intervenantId: string,
  file: File,
  type: string
): Promise<unknown> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  const response = await apiClient.post<{ success: boolean; data: unknown }>(
    `/intervenants/${intervenantId}/documents`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data || response;
}

/**
 * Supprimer un document
 */
export async function deleteDocument(
  intervenantId: string,
  documentId: string
): Promise<void> {
  await apiClient.delete(
    `/intervenants/${intervenantId}/documents/${documentId}`
  );
}

export interface Document {
  id: string;
  fileName: string;
  filePath: string;
  type: string;
  uploadedAt: string;
}

/**
 * Obtenir l'URL de téléchargement d'un document
 */
export function getDocumentDownloadUrl(
  intervenantId: string,
  documentId: string
): string {
  const baseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api/v1";
  return `${baseUrl}/intervenants/${intervenantId}/documents/${documentId}/download`;
}

/**
 * Télécharger un document avec authentification et retourner un blob URL
 */
export async function fetchDocumentAsBlob(
  intervenantId: string,
  documentId: string
): Promise<string | null> {
  try {
    const url = getDocumentDownloadUrl(intervenantId, documentId);
    const token = localStorage.getItem("vizion_academy_access_token");

    console.log("[fetchDocumentAsBlob] URL:", url);
    console.log("[fetchDocumentAsBlob] Token present:", !!token);

    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    console.log("[fetchDocumentAsBlob] Response status:", response.status);

    if (!response.ok) {
      console.error("[fetchDocumentAsBlob] Response not OK:", response.status, response.statusText);
      return null;
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    console.log("[fetchDocumentAsBlob] Blob URL created:", blobUrl);
    return blobUrl;
  } catch (error) {
    console.error("[fetchDocumentAsBlob] Error:", error);
    return null;
  }
}
