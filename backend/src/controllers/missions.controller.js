/**
 * ============================================
 * Vizion Academy - Contrôleur des Missions
 * CDC : Gestion des missions Ecole/Intervenant
 * ============================================
 */

import * as missionsService from '../services/missions.service.js';
import logger from '../utils/logger.js';

/**
 * GET /api/v1/missions
 * Liste toutes les missions avec filtres
 */
export async function getMissions(req, res, next) {
    try {
        const { ecoleId, intervenantId, status, take, skip, q } = req.query;
        logger.info('Get missions list', { ecoleId, intervenantId, status, q, requesterId: req.user?.id });
        
        const opts = {
            ecoleId: ecoleId || undefined,
            intervenantId: intervenantId || undefined,
            status: status || undefined,
            q: q || undefined,
            take: take ? parseInt(take, 10) : 50,
            skip: skip ? parseInt(skip, 10) : 0
        };
        const data = await missionsService.findAll(opts);
        logger.info('Missions list retrieved', { count: data.items?.length, requesterId: req.user?.id });
        res.json({ success: true, ...data });
    } catch (error) {
        logger.error('Get missions error', { requesterId: req.user?.id, error: error.message });
        next(error);
    }
}

/**
 * GET /api/v1/missions/ecole
 * Liste les missions déclarées par l'école connectée (CDC)
 * Middleware requis: verifyToken + checkRole(['ECOLE'])
 */
export async function getMissionsByEcole(req, res, next) {
    try {
        const userId = req.user.id;
        logger.info('Get missions by ecole', { userId });
        
        const data = await missionsService.findByEcoleUserId(userId, req.query);
        logger.info('Ecole missions retrieved', { count: data.items?.length, userId });
        res.json({ success: true, ...data });
    } catch (error) {
        logger.error('Get ecole missions error', { userId: req.user?.id, error: error.message });
        next(error);
    }
}

/**
 * GET /api/v1/missions/intervenant
 * Liste les missions affectées à l'intervenant connecté (CDC)
 * Middleware requis: verifyToken + checkRole(['INTERVENANT'])
 */
export async function getMissionsByIntervenant(req, res, next) {
    try {
        const userId = req.user.id;
        logger.info('Get missions by intervenant', { userId });
        
        const data = await missionsService.findByIntervenantUserId(userId, req.query);
        logger.info('Intervenant missions retrieved', { count: data.items?.length, userId });
        res.json({ success: true, ...data });
    } catch (error) {
        logger.error('Get intervenant missions error', { userId: req.user?.id, error: error.message });
        next(error);
    }
}

/**
 * POST /api/v1/missions
 * Déclaration d'une nouvelle mission par une école (CDC)
 * Middleware requis: verifyToken + checkRole(['ECOLE'])
 * Body: { title, description?, startDate?, endDate?, priceCents? }
 */
export async function createMission(req, res, next) {
    try {
        const payload = req.body;
        const userId = req.user.id;
        logger.info('Create mission attempt', { title: payload.title, userId });
        
        if (!payload.title) {
            logger.warn('Create mission failed: missing title', { userId });
            return res.status(400).json({ 
                success: false, 
                message: 'Le titre de la mission est requis.' 
            });
        }

        const created = await missionsService.createByEcole(payload, userId);
        logger.info('Mission created successfully', { missionId: created.id, title: created.title, userId });
        res.status(201).json({ success: true, data: created });
    } catch (err) {
        logger.error('Create mission error', { title: req.body.title, userId: req.user?.id, error: err.message });
        next(err);
    }
}

/**
 * GET /api/v1/missions/:id
 * Récupérer une mission par son ID
 */
export async function getMission(req, res, next) {
    try {
        const { id } = req.params;
        logger.info('Get mission by ID', { missionId: id, requesterId: req.user?.id });
        
        const mission = await missionsService.findById(id);
        if (!mission) {
            logger.warn('Mission not found', { missionId: id, requesterId: req.user?.id });
            return res.status(404).json({ success: false, message: 'Mission non trouvée.' });
        }
        
        logger.info('Mission retrieved', { missionId: id, requesterId: req.user?.id });
        res.json({ success: true, data: mission });
    } catch (err) {
        logger.error('Get mission error', { missionId: req.params.id, requesterId: req.user?.id, error: err.message });
        next(err);
    }
}

/**
 * PATCH /api/v1/missions/:id
 * Mise à jour d'une mission
 */
export async function updateMission(req, res, next) {
    try {
        const { id } = req.params;
        const payload = req.body;
        logger.info('Update mission attempt', { missionId: id, updateFields: Object.keys(payload), requesterId: req.user?.id });
        
        const updated = await missionsService.update(id, payload, req.user);
        if (!updated) {
            logger.warn('Update mission failed: not found', { missionId: id, requesterId: req.user?.id });
            return res.status(404).json({ success: false, message: 'Mission non trouvée.' });
        }
        
        logger.info('Mission updated successfully', { missionId: id, requesterId: req.user?.id });
        res.json({ success: true, data: updated });
    } catch (err) {
        logger.error('Update mission error', { missionId: req.params.id, requesterId: req.user?.id, error: err.message });
        next(err);
    }
}

/**
 * PATCH /api/v1/missions/:id/status
 * Changement du statut d'une mission (DRAFT, ACTIVE, COMPLETED)
 * Body: { status }
 */
export async function changeMissionStatus(req, res, next) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        logger.info('Change mission status attempt', { missionId: id, newStatus: status, requesterId: req.user?.id });
        
        if (!status) {
            logger.warn('Change mission status failed: status required', { missionId: id, requesterId: req.user?.id });
            return res.status(400).json({ success: false, message: 'Le statut est requis.' });
        }
        
        const updated = await missionsService.changeStatus(id, status, req.user);
        logger.info('Mission status changed successfully', { missionId: id, newStatus: status, requesterId: req.user?.id });
        res.json({ success: true, data: updated });
    } catch (err) {
        logger.error('Change mission status error', { missionId: req.params.id, status: req.body.status, requesterId: req.user?.id, error: err.message });
        next(err);
    }
}

/**
 * POST /api/v1/missions/:id/assign
 * Affecter un intervenant à une mission
 * Body: { intervenantId }
 */
export async function assignIntervenant(req, res, next) {
    try {
        const { id } = req.params;
        const { intervenantId } = req.body;
        logger.info('Assign intervenant to mission', { missionId: id, intervenantId, requesterId: req.user?.id });
        
        if (!intervenantId) {
            logger.warn('Assign intervenant failed: intervenantId required', { missionId: id, requesterId: req.user?.id });
            return res.status(400).json({ success: false, message: 'L\'ID de l\'intervenant est requis.' });
        }

        const updated = await missionsService.assignIntervenant(id, intervenantId, req.user);
        logger.info('Intervenant assigned to mission successfully', { missionId: id, intervenantId, requesterId: req.user?.id });
        res.json({ success: true, data: updated });
    } catch (err) {
        logger.error('Assign intervenant error', { missionId: req.params.id, intervenantId: req.body.intervenantId, requesterId: req.user?.id, error: err.message });
        next(err);
    }
}

/**
 * DELETE /api/v1/missions/:id
 * Supprimer une mission
 */
export async function removeMission(req, res, next) {
    try {
        const { id } = req.params;
        logger.info('Delete mission attempt', { missionId: id, requesterId: req.user?.id });

        await missionsService.remove(id, req.user);
        logger.info('Mission deleted successfully', { missionId: id, requesterId: req.user?.id });
        res.json({ success: true, message: 'Mission supprimée.' });
    } catch (err) {
        logger.error('Delete mission error', { missionId: req.params.id, requesterId: req.user?.id, error: err.message });
        next(err);
    }
}

/**
 * POST /api/v1/missions/:id/apply
 * Permet à un intervenant de postuler à une mission (crée une candidature)
 */
export async function applyToMission(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { message, tarifPropose } = req.body;
        logger.info('Apply to mission attempt', { missionId: id, userId });

        const candidature = await missionsService.applyToMission(id, userId, { message, tarifPropose });
        logger.info('Candidature created successfully', { missionId: id, candidatureId: candidature.id, userId });
        res.json({ success: true, data: candidature, message: 'Candidature envoyée avec succès!' });
    } catch (err) {
        logger.error('Apply to mission error', { missionId: req.params.id, userId: req.user?.id, error: err.message });
        next(err);
    }
}

/**
 * GET /api/v1/missions/:id/candidatures
 * Récupère les candidatures d'une mission (pour l'école propriétaire)
 */
export async function getCandidatures(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        logger.info('Get mission candidatures', { missionId: id, userId });

        const candidatures = await missionsService.getCandidatures(id, userId);
        logger.info('Candidatures retrieved', { missionId: id, count: candidatures.length, userId });
        res.json({ success: true, data: candidatures });
    } catch (err) {
        logger.error('Get candidatures error', { missionId: req.params.id, userId: req.user?.id, error: err.message });
        next(err);
    }
}

/**
 * POST /api/v1/missions/candidatures/:candidatureId/accept
 * L'école accepte une candidature (assigne l'intervenant à la mission)
 */
export async function acceptCandidature(req, res, next) {
    try {
        const { candidatureId } = req.params;
        const userId = req.user.id;
        logger.info('Accept candidature attempt', { candidatureId, userId });

        const mission = await missionsService.acceptCandidature(candidatureId, userId);
        logger.info('Candidature accepted, intervenant assigned', { candidatureId, missionId: mission.id, userId });
        res.json({ success: true, data: mission, message: 'Candidature acceptée! L\'intervenant a été assigné à la mission.' });
    } catch (err) {
        logger.error('Accept candidature error', { candidatureId: req.params.candidatureId, userId: req.user?.id, error: err.message });
        next(err);
    }
}

/**
 * POST /api/v1/missions/candidatures/:candidatureId/reject
 * L'école refuse une candidature
 */
export async function rejectCandidature(req, res, next) {
    try {
        const { candidatureId } = req.params;
        const userId = req.user.id;
        logger.info('Reject candidature attempt', { candidatureId, userId });

        const candidature = await missionsService.rejectCandidature(candidatureId, userId);
        logger.info('Candidature rejected', { candidatureId, userId });
        res.json({ success: true, data: candidature, message: 'Candidature refusée.' });
    } catch (err) {
        logger.error('Reject candidature error', { candidatureId: req.params.candidatureId, userId: req.user?.id, error: err.message });
        next(err);
    }
}

/**
 * POST /api/v1/missions/candidatures/:candidatureId/withdraw
 * L'intervenant retire sa candidature
 */
export async function withdrawCandidature(req, res, next) {
    try {
        const { candidatureId } = req.params;
        const userId = req.user.id;
        logger.info('Withdraw candidature attempt', { candidatureId, userId });

        const candidature = await missionsService.withdrawCandidature(candidatureId, userId);
        logger.info('Candidature withdrawn', { candidatureId, userId });
        res.json({ success: true, data: candidature, message: 'Candidature retirée.' });
    } catch (err) {
        logger.error('Withdraw candidature error', { candidatureId: req.params.candidatureId, userId: req.user?.id, error: err.message });
        next(err);
    }
}

/**
 * GET /api/v1/missions/candidatures/mes-candidatures
 * Récupère toutes les candidatures de l'intervenant connecté
 */
export async function getMyCandidatures(req, res, next) {
    try {
        const userId = req.user.id;
        logger.info('Get my candidatures', { userId });

        const candidatures = await missionsService.getMyCandidatures(userId);
        logger.info('My candidatures retrieved', { count: candidatures.length, userId });
        res.json({ success: true, data: candidatures });
    } catch (err) {
        logger.error('Get my candidatures error', { userId: req.user?.id, error: err.message });
        next(err);
    }
}