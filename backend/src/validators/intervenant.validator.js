import Joi from 'joi';

// Schéma pour la création d'un intervenant (via inscription)
export const createIntervenantSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(2).max(100).required(),
  password: Joi.string().min(8).required(),
  siret: Joi.string().length(14).pattern(/^[0-9]+$/).required(),
  specialite: Joi.string().max(200).optional(),
  tarifHoraire: Joi.number().positive().optional()
});

// Schéma pour la mise à jour d'un intervenant
export const updateIntervenantSchema = Joi.object({
  siret: Joi.string().length(14).pattern(/^[0-9]+$/).optional(),
  specialite: Joi.string().max(200).optional(),
  tarifHoraire: Joi.number().positive().optional()
});

// Schéma pour la validation/rejet d'un intervenant par admin
export const validateIntervenantSchema = Joi.object({
  status: Joi.string().valid('VALIDE', 'REFUSE').required()
});

// Schéma pour l'ajout d'un document
export const addDocumentSchema = Joi.object({
  type: Joi.string().valid('CV', 'DIPLOME', 'KBIS', 'ASSURANCE', 'RIB', 'AUTRE').required(),
  nom: Joi.string().max(200).required(),
  url: Joi.string().uri().required()
});