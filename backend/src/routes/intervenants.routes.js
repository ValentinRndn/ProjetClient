/**
 * ============================================
 * Vizion Academy - Routes des Intervenants
 * CDC : Gestion des intervenants et documents
 * ============================================
 */

import { Router } from "express";
import {
  getIntervenant,
  getIntervenants,
  updateIntervenant,
  updateIntervenantStatus,
  getDocuments,
  uploadDocument,
  downloadDocument,
  deleteDocument,
} from "../controllers/intervenants.controller.js";
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { updateIntervenantSchema } from "../validators/intervenant.validator.js";
import { uploadSingleOptional } from "../config/multer.js";
import Joi from "joi";

const router = Router();

// Schemas de validation
const querySchema = Joi.object({
  take: Joi.number().integer().min(1).max(100).default(50),
  skip: Joi.number().integer().min(0).default(0),
  status: Joi.string().valid("pending", "approved", "rejected").optional(),
});

const paramsSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

const statusSchema = Joi.object({
  status: Joi.string().valid("pending", "approved", "rejected").required(),
});

// Types de documents pour l'onboarding complet
const DOCUMENT_TYPES = [
  'CV', 'DIPLOME', 'KBIS', 'ASSURANCE', 'RIB',
  'PIECE_IDENTITE', 'ATTESTATION_URSSAF', 'ATTESTATION_FISCALE',
  'CASIER_JUDICIAIRE', 'PROFILE_IMAGE', 'AUTRE'
];

const documentSchema = Joi.object({
  fileName: Joi.string().required(),
  filePath: Joi.string().required(),
  type: Joi.string().valid(...DOCUMENT_TYPES).required(),
});

// Routes CRUD intervenants
router.get("/", validate({ query: querySchema }), getIntervenants);

// Route publique pour voir le profil d'un intervenant approuvé
router.get(
  "/public/:id",
  validate({ params: paramsSchema }),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const service = await import('../services/intervenants.service.js');
      const intervenant = await service.findById(id, true); // true = publicOnly

      if (!intervenant) {
        return res.status(404).json({ success: false, message: 'Intervenant non trouvé' });
      }

      // Vérifier que l'intervenant est approuvé
      if (intervenant.status !== 'approved') {
        return res.status(404).json({ success: false, message: 'Intervenant non disponible' });
      }

      res.json({ success: true, data: intervenant });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:id",
  validate({ params: paramsSchema }),
  verifyToken,
  getIntervenant
);
router.patch(
  "/:id",
  validate({ params: paramsSchema, body: updateIntervenantSchema }),
  verifyToken,
  checkRole(["ADMIN", "INTERVENANT"]),
  updateIntervenant
);

// Changer le statut d'un intervenant (ADMIN only)
router.patch(
  "/:id/status",
  validate({ params: paramsSchema, body: statusSchema }),
  verifyToken,
  checkRole(["ADMIN"]),
  updateIntervenantStatus
);

// Gestion des documents (CDC MVP)
router.get(
  "/:id/documents",
  validate({ params: paramsSchema }),
  verifyToken,
  getDocuments
);
// Route publique pour télécharger/afficher un document (CV, photo de profil)
router.get(
  "/:id/documents/:docId/download",
  validate({
    params: Joi.object({
      id: Joi.string().uuid().required(),
      docId: Joi.string().uuid().required(),
    }),
  }),
  downloadDocument
);
// Upload document avec multer (FormData) - validation désactivée pour multipart
router.post(
  "/:id/documents",
  validate({ params: paramsSchema }),
  verifyToken,
  checkRole(["ADMIN", "INTERVENANT"]),
  uploadSingleOptional("file"),
  uploadDocument
);
router.delete(
  "/:id/documents/:docId",
  validate({
    params: Joi.object({
      id: Joi.string().uuid().required(),
      docId: Joi.string().uuid().required(),
    }),
  }),
  verifyToken,
  checkRole(["ADMIN", "INTERVENANT"]),
  deleteDocument
);

export default router;
