/**
 * ============================================
 * Vizion Academy - Routes Principales
 * ============================================
 */

import { Router } from 'express';

import authRoutes from './auth.routes.js';
import usersRoutes from './users.routes.js';
import schoolsRoutes from './schools.routes.js';
import intervenantsRoutes from './intervenants.routes.js';
import missionsRoutes from './missions.routes.js';

const router = Router();

// Routes d'authentification (publiques + protégées)
router.use('/auth', authRoutes);

// Routes utilisateurs (admin)
router.use('/users', usersRoutes);

// Routes écoles
router.use('/ecoles', schoolsRoutes);

// Routes intervenants
router.use('/intervenants', intervenantsRoutes);

// Routes missions
router.use('/missions', missionsRoutes);

export default router;