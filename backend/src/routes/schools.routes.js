/**
 * ============================================
 * Vizion Academy - Routes des Écoles
 * CDC : Gestion des écoles
 * ============================================
 */

import { Router } from "express";
import {
  createSchool,
  getSchools,
  getPublicSchools,
  getSchool,
  updateSchool,
  deleteSchool,
  dashboard,
  declareMission,
} from "../controllers/schools.controller.js";
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import Joi from "joi";

const router = Router();

// Schemas de validation
const paramsSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

const createSchoolSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  contactEmail: Joi.string().email().optional(),
  address: Joi.string().max(500).optional(),
  phone: Joi.string().max(20).optional(),
});

const updateSchoolSchema = Joi.object({
  name: Joi.string().min(2).max(200).optional(),
  contactEmail: Joi.string().email().optional(),
  address: Joi.string().max(500).optional(),
  phone: Joi.string().max(20).optional(),
});

// Route publique pour lister les écoles (pour filtres)
router.get("/public", getPublicSchools);

// Routes CRUD écoles (protégées)
router.post(
  "/",
  validate(createSchoolSchema),
  verifyToken,
  checkRole(["ADMIN"]),
  createSchool
);
router.get("/", verifyToken, checkRole(["ADMIN"]), getSchools);
router.get("/:id", validate({ params: paramsSchema }), verifyToken, getSchool);
router.patch(
  "/:id",
  validate({ params: paramsSchema, body: updateSchoolSchema }),
  verifyToken,
  checkRole(["ADMIN", "ECOLE"]),
  updateSchool
);
router.delete(
  "/:id",
  validate({ params: paramsSchema }),
  verifyToken,
  checkRole(["ADMIN"]),
  deleteSchool
);

// Dashboard école
router.get(
  "/:id/dashboard",
  validate({ params: paramsSchema }),
  verifyToken,
  checkRole(["ADMIN", "ECOLE"]),
  dashboard
);

// Déclarer une mission (école déclare une mission)
router.post(
  "/:id/declare-mission",
  validate({ params: paramsSchema }),
  verifyToken,
  checkRole(["ECOLE", "ADMIN"]),
  declareMission
);

export default router;
