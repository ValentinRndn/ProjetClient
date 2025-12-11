/**
 * ============================================
 * Vizion Academy - Routes des Missions
 * CDC : Gestion des missions Ecole/Intervenant
 * ============================================
 */

import { Router } from 'express';
import {
    createMission,
    getMissions,
    getMission,
    getMissionsByEcole,
    getMissionsByIntervenant,
    updateMission,
    changeMissionStatus,
    assignIntervenant,
    applyToMission,
    removeMission
} from '../controllers/missions.controller.js';
import { verifyToken, checkRole } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { createMissionSchema, updateMissionSchema, updateMissionStatusSchema } from '../validators/mission.validator.js';
import Joi from 'joi';

const router = Router();

// ============================================
// Schemas de validation
// ============================================
const querySchema = Joi.object({
    ecoleId: Joi.string().uuid().optional(),
    intervenantId: Joi.string().uuid().optional(),
    status: Joi.string().valid('DRAFT', 'ACTIVE', 'COMPLETED').optional(),
    take: Joi.number().integer().min(1).max(100).default(50),
    skip: Joi.number().integer().min(0).default(0),
    q: Joi.string().max(100).optional()
});

const paramsSchema = Joi.object({ 
    id: Joi.string().uuid().required() 
});

const assignSchema = Joi.object({
    intervenantId: Joi.string().uuid().required()
});

// ============================================
// Routes CDC - Missions par rôle
// ============================================

/**
 * GET /api/v1/missions/ecole
 * Historique des missions déclarées par l'école connectée (CDC)
 * Middleware: verifyToken (authentification requise)
 * Accès: ECOLE uniquement
 */
router.get('/ecole', verifyToken, checkRole(['ECOLE', 'ADMIN']), getMissionsByEcole);

/**
 * GET /api/v1/missions/intervenant
 * Historique des missions affectées à l'intervenant connecté (CDC)
 * Middleware: verifyToken (authentification requise)
 * Accès: INTERVENANT uniquement
 */
router.get('/intervenant', verifyToken, checkRole(['INTERVENANT', 'ADMIN']), getMissionsByIntervenant);

// ============================================
// Routes CRUD classiques
// ============================================

/**
 * GET /api/v1/missions
 * Liste toutes les missions avec filtres
 * Query: ?ecoleId=&intervenantId=&status=&take=&skip=&q=
 */
router.get('/', validate({ query: querySchema }), verifyToken, getMissions);

/**
 * POST /api/v1/missions
 * Déclaration d'une nouvelle mission (CDC)
 * Middleware: checkRole(['ECOLE']) - Seules les écoles peuvent créer des missions
 */
router.post('/', validate(createMissionSchema), verifyToken, checkRole(['ECOLE', 'ADMIN']), createMission);

/**
 * GET /api/v1/missions/:id
 * Récupérer une mission par son ID
 */
router.get('/:id', validate({ params: paramsSchema }), verifyToken, getMission);

/**
 * PATCH /api/v1/missions/:id
 * Mise à jour d'une mission
 */
router.patch('/:id', validate({ params: paramsSchema, body: updateMissionSchema }), verifyToken, checkRole(['ECOLE', 'ADMIN']), updateMission);

/**
 * PATCH /api/v1/missions/:id/status
 * Changement du statut d'une mission (DRAFT, ACTIVE, COMPLETED)
 */
router.patch('/:id/status', validate({ params: paramsSchema, body: updateMissionStatusSchema }), verifyToken, checkRole(['ECOLE', 'ADMIN']), changeMissionStatus);

/**
 * POST /api/v1/missions/:id/assign
 * Affecter un intervenant à une mission
 */
router.post('/:id/assign', validate({ params: paramsSchema, body: assignSchema }), verifyToken, checkRole(['ECOLE', 'ADMIN']), assignIntervenant);

/**
 * POST /api/v1/missions/:id/apply
 * Permet à un intervenant de postuler à une mission
 */
router.post('/:id/apply', validate({ params: paramsSchema }), verifyToken, checkRole(['INTERVENANT']), applyToMission);

/**
 * DELETE /api/v1/missions/:id
 * Supprimer une mission
 */
router.delete('/:id', validate({ params: paramsSchema }), verifyToken, checkRole(['ECOLE', 'ADMIN']), removeMission);

export default router;