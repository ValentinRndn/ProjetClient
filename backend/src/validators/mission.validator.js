/**
 * ============================================
 * Vizion Academy - Validateurs des Missions
 * CDC MVP : Status DRAFT, ACTIVE, COMPLETED
 * ============================================
 */

import Joi from 'joi';

/**
 * Schéma de validation pour la création d'une mission (CDC)
 * Note: ecoleId est automatiquement récupéré depuis l'utilisateur connecté
 */
export const createMissionSchema = Joi.object({
    title: Joi.string().min(3).max(200).required().messages({
        'string.min': 'Le titre doit contenir au moins 3 caractères.',
        'string.max': 'Le titre ne peut pas dépasser 200 caractères.',
        'any.required': 'Le titre de la mission est requis.'
    }),
    description: Joi.string().max(5000).optional().messages({
        'string.max': 'La description ne peut pas dépasser 5000 caractères.'
    }),
    startDate: Joi.date().iso().optional().messages({
        'date.format': 'Format de date invalide. Utilisez le format ISO 8601.'
    }),
    endDate: Joi.date().iso().greater(Joi.ref('startDate')).optional().messages({
        'date.greater': 'La date de fin doit être postérieure à la date de début.'
    }),
    priceCents: Joi.number().integer().min(0).optional().messages({
        'number.min': 'Le prix ne peut pas être négatif.',
        'number.integer': 'Le prix doit être un nombre entier (en centimes).'
    })
});

/**
 * Schéma de validation pour la mise à jour d'une mission
 */
export const updateMissionSchema = Joi.object({
    title: Joi.string().min(3).max(200).optional().messages({
        'string.min': 'Le titre doit contenir au moins 3 caractères.',
        'string.max': 'Le titre ne peut pas dépasser 200 caractères.'
    }),
    description: Joi.string().max(5000).optional().messages({
        'string.max': 'La description ne peut pas dépasser 5000 caractères.'
    }),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
    priceCents: Joi.number().integer().min(0).optional()
});

/**
 * Schéma de validation pour le changement de statut (CDC MVP)
 * Status autorisés: DRAFT, ACTIVE, COMPLETED
 */
export const updateMissionStatusSchema = Joi.object({
    status: Joi.string().valid('DRAFT', 'ACTIVE', 'COMPLETED').required().messages({
        'any.only': 'Statut invalide. Valeurs acceptées: DRAFT, ACTIVE, COMPLETED.',
        'any.required': 'Le statut est requis.'
    })
});