/**
 * Service de gestion des déclarations d'activité (URSSAF-like)
 */

import api from "@/lib/api";

export interface Declaration {
  id: string;
  intervenantId: string;
  periode: string;
  type: "mensuelle" | "trimestrielle";
  chiffreAffaires: number;
  nbMissions: number;
  nbHeures: number;
  fraisPro: number;
  cotisationsSociales: number;
  contributionFormation: number;
  status: "brouillon" | "validee" | "transmise";
  notes?: string;
  createdAt: string;
  updatedAt: string;
  validatedAt?: string;
}

export interface DeclarationTotaux {
  annee: number;
  chiffreAffaires: number;
  nbMissions: number;
  nbHeures: number;
  cotisationsSociales: number;
  contributionFormation: number;
}

export interface DeclarationsResponse {
  success: boolean;
  data: Declaration[];
  totaux: DeclarationTotaux;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateDeclarationData {
  periode: string;
  type?: "mensuelle" | "trimestrielle";
  chiffreAffaires?: number;
  nbMissions?: number;
  nbHeures?: number;
  fraisPro?: number;
  notes?: string;
}

export interface UpdateDeclarationData {
  chiffreAffaires?: number;
  nbMissions?: number;
  nbHeures?: number;
  fraisPro?: number;
  notes?: string;
  status?: "brouillon" | "validee";
}

/**
 * Récupérer toutes les déclarations
 */
export async function getDeclarations(
  annee?: number,
  status?: string,
  page = 1,
  limit = 20
): Promise<DeclarationsResponse> {
  const params = new URLSearchParams();
  if (annee) params.append("annee", String(annee));
  if (status) params.append("status", status);
  params.append("page", String(page));
  params.append("limit", String(limit));

  return api.get(`/declarations?${params.toString()}`);
}

/**
 * Récupérer une déclaration par ID
 */
export async function getDeclaration(
  id: string
): Promise<{ success: boolean; data: Declaration }> {
  return api.get(`/declarations/${id}`);
}

/**
 * Créer une nouvelle déclaration
 */
export async function createDeclaration(
  data: CreateDeclarationData
): Promise<{ success: boolean; message: string; data: Declaration }> {
  return api.post("/declarations", data);
}

/**
 * Mettre à jour une déclaration
 */
export async function updateDeclaration(
  id: string,
  data: UpdateDeclarationData
): Promise<{ success: boolean; message: string; data: Declaration }> {
  return api.patch(`/declarations/${id}`, data);
}

/**
 * Supprimer une déclaration
 */
export async function deleteDeclaration(
  id: string
): Promise<{ success: boolean; message: string }> {
  return api.delete(`/declarations/${id}`);
}

/**
 * Valider une déclaration
 */
export async function validerDeclaration(
  id: string
): Promise<{ success: boolean; message: string; data: Declaration }> {
  return api.post(`/declarations/${id}/valider`);
}

/**
 * Formater un montant en centimes en euros
 */
export function formatMontant(centimes: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(centimes / 100);
}

/**
 * Formater une période
 */
export function formatPeriode(periode: string): string {
  const [annee, mois] = periode.split("-");
  const moisNoms = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  return `${moisNoms[parseInt(mois) - 1]} ${annee}`;
}

/**
 * Générer la période courante
 */
export function getCurrentPeriode(): string {
  const now = new Date();
  const annee = now.getFullYear();
  const mois = String(now.getMonth() + 1).padStart(2, "0");
  return `${annee}-${mois}`;
}

/**
 * Générer les périodes pour un sélecteur
 */
export function generatePeriodes(nbMois = 12): { value: string; label: string }[] {
  const periodes = [];
  const now = new Date();

  for (let i = 0; i < nbMois; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const annee = date.getFullYear();
    const mois = String(date.getMonth() + 1).padStart(2, "0");
    const periode = `${annee}-${mois}`;
    periodes.push({
      value: periode,
      label: formatPeriode(periode),
    });
  }

  return periodes;
}
