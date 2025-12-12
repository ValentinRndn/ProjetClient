/**
 * Service de contact
 * Gère les formulaires de contact et partenariat
 */

import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api/v1";

export type ContactType = "contact" | "partenariat" | "support" | "autre";

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  type: ContactType;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    createdAt: string;
  };
}

/**
 * Envoyer un message de contact (sans authentification)
 */
export async function submitContactForm(
  data: ContactFormData
): Promise<ContactResponse> {
  const response = await axios.post<ContactResponse>(
    `${API_BASE_URL}/contact`,
    data
  );
  return response.data;
}
