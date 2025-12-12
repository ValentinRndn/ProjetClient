import { Router } from "express";
import bcrypt from "bcrypt";
import Joi from "joi";
import {
  listUsers,
  getLogs,
  validateIntervenant,
  createExport,
  getExport,
  getStats,
  reloadCache,
} from "../controllers/admin.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import prisma from "../../prisma.js";
import logger from "../utils/logger.js";
import { sendWelcomeNotification } from "../services/email.service.js";

// Validation schema pour création école
const createEcoleSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().min(2).max(200).required(),
  contactEmail: Joi.string().email().optional().allow(''),
  phone: Joi.string().max(20).optional().allow(''),
  address: Joi.string().max(500).optional().allow(''),
});

const router = Router();

// Toutes les routes admin nécessitent authentification
router.use(verifyToken);

// Middleware personnalisé pour vérifier le rôle ADMIN (vérifie dans la DB)
router.use(async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Authentification requise",
      });
    }

    // Récupérer le rôle depuis la DB pour être sûr (le token peut être ancien)
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { role: true },
    });

    if (!user) {
      logger.warn("User not found in database", { userId: req.user.id });
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // Vérifier que l'utilisateur est ADMIN
    if (user.role !== "ADMIN") {
      logger.warn("Admin route access denied", {
        userId: req.user.id,
        userRole: user.role,
        path: req.path,
      });
      return res.status(403).json({
        success: false,
        message: `Accès interdit. Rôle requis: ADMIN, votre rôle: ${user.role}`,
      });
    }

    // Mettre à jour req.user avec le rôle réel de la DB
    req.user.role = user.role;

    logger.info("Admin access granted", {
      userId: req.user.id,
      role: user.role,
      path: req.path,
    });

    next();
  } catch (err) {
    logger.error("Error checking admin role", {
      error: err.message,
      userId: req.user?.id,
    });
    next(err);
  }
});

// Users
router.get("/users", listUsers);

// Logs (audit)
router.get("/logs", getLogs);

// Intervenant validation
router.post("/intervenants/:id/validate", validateIntervenant);

// Exports
router.post("/export", createExport);
router.get("/export/:id", getExport);

// Stats / dashboard
router.get("/stats", getStats);

// Ops: reload cache (internal)
router.post("/reload-cache", reloadCache);

/**
 * POST /api/v1/admin/ecoles
 * Créer un compte école par l'admin
 */
router.post("/ecoles", validate({ body: createEcoleSchema }), async (req, res, next) => {
  try {
    const { email, password, name, contactEmail, phone, address } = req.body;

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Cet email est déjà utilisé",
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur et l'école en transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: "ECOLE",
        },
      });

      const ecole = await tx.ecole.create({
        data: {
          userId: user.id,
          name,
          contactEmail: contactEmail || email,
          phone,
          address,
        },
      });

      return { user, ecole };
    });

    // Envoyer notification de bienvenue
    try {
      await sendWelcomeNotification(result.user.id, name);
    } catch (emailError) {
      logger.warn("Failed to send welcome notification", { error: emailError.message });
    }

    logger.info("École created by admin", {
      adminId: req.user.id,
      ecoleId: result.ecole.id,
      email,
    });

    res.status(201).json({
      success: true,
      message: "Compte école créé avec succès",
      data: {
        id: result.ecole.id,
        userId: result.user.id,
        name: result.ecole.name,
        email: result.user.email,
      },
    });
  } catch (error) {
    logger.error("Error creating école", { error: error.message });
    next(error);
  }
});

export default router;
