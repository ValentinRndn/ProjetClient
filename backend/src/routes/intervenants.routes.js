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

const documentSchema = Joi.object({
  fileName: Joi.string().required(),
  filePath: Joi.string().required(),
  type: Joi.string().valid("CV", "RIB", "KBIS", "DIPLOME", "AUTRE").required(),
});

// Routes CRUD intervenants
router.get("/", validate({ query: querySchema }), getIntervenants);
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
router.post(
  "/:id/documents",
  validate({ params: paramsSchema, body: documentSchema }),
  verifyToken,
  checkRole(["ADMIN", "INTERVENANT"]),
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
