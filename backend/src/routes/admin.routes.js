import { Router } from "express";
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
import prisma from "../../prisma.js";
import logger from "../utils/logger.js";

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

export default router;
