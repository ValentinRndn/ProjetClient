/**
 * ============================================
 * Vizion Academy - Routes Principales
 * ============================================
 */

import { Router } from "express";

import authRoutes from "./auth.routes.js";
import usersRoutes from "./users.routes.js";
import schoolsRoutes from "./schools.routes.js";
import intervenantsRoutes from "./intervenants.routes.js";
import missionsRoutes from "./missions.routes.js";
import adminRoutes from "./admin.routes.js";
import contactRoutes from "./contact.routes.js";
import favoritesRoutes from "./favorites.routes.js";
import declarationsRoutes from "./declarations.routes.js";
import facturesRoutes from "./factures.routes.js";
import trackingRoutes from "./tracking.routes.js";
import notificationsRoutes from "./notifications.routes.js";
import backofficeRoutes from "./backoffice.routes.js";
import collaborationsRoutes from "./collaborations.routes.js";
import challengesRoutes from "./challenges.routes.js";

const router = Router();

// Routes d'authentification (publiques + protégées)
router.use("/auth", authRoutes);

// Routes utilisateurs (admin)
router.use("/users", usersRoutes);

// Routes écoles
router.use("/ecoles", schoolsRoutes);

// Routes intervenants
router.use("/intervenants", intervenantsRoutes);

// Routes missions
router.use("/missions", missionsRoutes);

// Routes admin (protégées par vérification de rôle)
router.use("/admin", adminRoutes);

// Routes contact (formulaires publics + gestion admin)
router.use("/contact", contactRoutes);

// Routes favoris (écoles uniquement)
router.use("/favorites", favoritesRoutes);

// Routes déclarations d'activité (intervenants)
router.use("/declarations", declarationsRoutes);

// Routes factures (école/intervenant/admin)
router.use("/factures", facturesRoutes);

// Routes tracking (consultation de profils)
router.use("/tracking", trackingRoutes);

// Routes notifications (in-app + emails)
router.use("/notifications", notificationsRoutes);

// Routes back-office (admin: thématiques, partenaires, témoignages, FAQ, audit)
router.use("/backoffice", backofficeRoutes);

// Routes collaborations (écoles + intervenants)
router.use("/collaborations", collaborationsRoutes);

// Routes challenges (intervenants créent, admin valide)
router.use("/challenges", challengesRoutes);

export default router;
