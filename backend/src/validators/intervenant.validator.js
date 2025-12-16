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
  // Informations personnelles
  firstName: Joi.string().max(100).optional().allow(''),
  lastName: Joi.string().max(100).optional().allow(''),
  bio: Joi.string().max(2000).optional().allow(''),
  phone: Joi.string().max(20).optional().allow(''),
  city: Joi.string().max(100).optional().allow(''),

  // Informations professionnelles
  siret: Joi.string().length(14).pattern(/^[0-9]+$/).optional().allow(''),
  yearsExperience: Joi.number().integer().min(0).max(60).optional().allow(null),
  expertises: Joi.array().items(Joi.string().max(100)).max(20).optional(),

  // Liens et médias
  videoUrl: Joi.string().uri().max(500).optional().allow(''),
  linkedinUrl: Joi.string().uri().max(500).optional().allow(''),
  website: Joi.string().uri().max(500).optional().allow(''),
  profileImage: Joi.string().max(500).optional().allow(''),

  // Disponibilités (format JSON)
  disponibility: Joi.alternatives().try(
    Joi.boolean(),
    Joi.object()
  ).optional(),

  // Nouveaux champs profil enrichi
  diplomas: Joi.array().items(Joi.string().max(200)).max(20).optional(),
  availabilityModes: Joi.array().items(Joi.string().valid('presentiel', 'hybride', 'distanciel')).optional(),
  availabilityLocation: Joi.string().max(200).optional().allow(''),
  experiences: Joi.array().items(
    Joi.object({
      title: Joi.string().max(200).required(),
      company: Joi.string().max(200).required(),
      startDate: Joi.string().required(),
      endDate: Joi.string().optional().allow(''),
      description: Joi.string().max(2000).optional().allow('')
    })
  ).max(20).optional(),
  softwares: Joi.array().items(Joi.string().max(100)).max(30).optional(),
  languages: Joi.array().items(
    Joi.object({
      language: Joi.string().max(100).required(),
      level: Joi.string().valid('debutant', 'intermediaire', 'avance', 'natif').required()
    })
  ).max(10).optional(),

  // Champs hérités
  specialite: Joi.string().max(200).optional().allow(''),
  tarifHoraire: Joi.number().positive().optional().allow(null)
});

// Schéma pour la validation/rejet d'un intervenant par admin
export const validateIntervenantSchema = Joi.object({
  status: Joi.string().valid('VALIDE', 'REFUSE').required()
});

// Types de documents pour l'onboarding complet (10 pièces)
export const DOCUMENT_TYPES = [
  'CV',                    // 1. Curriculum Vitae
  'DIPLOME',               // 2. Diplômes et certifications
  'KBIS',                  // 3. Extrait KBIS (auto-entrepreneurs)
  'ASSURANCE',             // 4. Attestation d'assurance RC Pro
  'RIB',                   // 5. Relevé d'identité bancaire
  'PIECE_IDENTITE',        // 6. Pièce d'identité (CNI/Passeport)
  'ATTESTATION_URSSAF',    // 7. Attestation de vigilance URSSAF
  'ATTESTATION_FISCALE',   // 8. Attestation de régularité fiscale
  'CASIER_JUDICIAIRE',     // 9. Extrait de casier judiciaire (B3)
  'PROFILE_IMAGE',         // 10. Photo de profil professionnelle
  'AUTRE'                  // Documents complémentaires
];

// Schéma pour l'ajout d'un document
export const addDocumentSchema = Joi.object({
  type: Joi.string().valid(...DOCUMENT_TYPES).required(),
  nom: Joi.string().max(200).required(),
  url: Joi.string().uri().required()
});
