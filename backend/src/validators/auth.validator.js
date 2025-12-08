/**
 * ============================================
 * Vizion Academy - Validateurs d'Authentification
 * CDC Article 5 : Validation des données
 * ============================================
 */

import Joi from 'joi';

/**
 * Schéma de validation pour le login
 */
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Format d\'email invalide.',
    'any.required': 'L\'email est requis.'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Le mot de passe doit contenir au moins 6 caractères.',
    'any.required': 'Le mot de passe est requis.'
  })
});

/**
 * Schéma de validation pour l'inscription (CDC Article 5)
 * Rôles valides: ADMIN, ECOLE, INTERVENANT
 */
export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Format d\'email invalide.',
    'any.required': 'L\'email est requis.'
  }),
  password: Joi.string().min(8).max(100).required().messages({
    'string.min': 'Le mot de passe doit contenir au moins 8 caractères.',
    'string.max': 'Le mot de passe ne peut pas dépasser 100 caractères.',
    'any.required': 'Le mot de passe est requis.'
  }),
  role: Joi.string().valid('ADMIN', 'ECOLE', 'INTERVENANT').required().messages({
    'any.only': 'Rôle invalide. Valeurs acceptées: ADMIN, ECOLE, INTERVENANT.',
    'any.required': 'Le rôle est requis.'
  }),
  name: Joi.string().min(2).max(100).optional(),
  
  // Données spécifiques pour le rôle ECOLE
  ecoleData: Joi.object({
    name: Joi.string().min(2).max(200).required().messages({
      'any.required': 'Le nom de l\'école est requis.'
    }),
    contactEmail: Joi.string().email().optional(),
    address: Joi.string().max(500).optional(),
    phone: Joi.string().max(20).optional()
  }).when('role', {
    is: 'ECOLE',
    then: Joi.required().messages({
      'any.required': 'Les données de l\'école sont requises pour le rôle ECOLE.'
    }),
    otherwise: Joi.optional()
  }),
  
  // Données spécifiques pour le rôle INTERVENANT
  intervenantData: Joi.object({
    bio: Joi.string().max(2000).optional(),
    siret: Joi.string().max(20).optional(),
    disponibility: Joi.object().optional()
  }).optional()
});

/**
 * Schéma de validation pour le refresh token
 */
export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'Le refresh token est requis.'
  })
});