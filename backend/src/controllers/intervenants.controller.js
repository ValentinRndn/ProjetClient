/**
 * ============================================
 * Vizion Academy - Contrôleur des Intervenants
 * CDC : Gestion des intervenants et documents
 * ============================================
 */

import * as intervenantsService from '../services/intervenants.service.js';
import logger from '../utils/logger.js';

/**
 * GET /api/v1/intervenants
 * Lister tous les intervenants
 */
export async function getIntervenants(req, res, next) {
    try {
        const { status, take, skip } = req.query;
        logger.info('Get intervenants list', { status, take, skip, requesterId: req.user?.id });
        
        const opts = {
            status,
            take: take ? parseInt(take, 10) : undefined,
            skip: skip ? parseInt(skip, 10) : undefined
        };
        const data = await intervenantsService.findAll(opts);
        logger.info('Intervenants list retrieved', { count: data.length });
        res.json({ success: true, data });
    } catch (err) {
        logger.error('Get intervenants error', { error: err.message });
        next(err);
    }
}

/**
 * GET /api/v1/intervenants/:id
 * Récupérer un intervenant par son ID
 */
export async function getIntervenant(req, res, next) {
    try {
        const { id } = req.params;
        logger.info('Get intervenant by ID', { intervenantId: id, requesterId: req.user?.id });
        
        const data = await intervenantsService.findById(id);
        if (!data) {
            logger.warn('Intervenant not found', { intervenantId: id });
            return res.status(404).json({ success: false, message: 'Intervenant non trouvé.' });
        }
        
        logger.info('Intervenant retrieved', { intervenantId: id });
        res.json({ success: true, data });
    } catch (err) {
        logger.error('Get intervenant error', { intervenantId: req.params.id, error: err.message });
        next(err);
    }
}

/**
 * PATCH /api/v1/intervenants/:id
 * Mettre à jour un intervenant
 */
export async function updateIntervenant(req, res, next) {
    try {
        const { id } = req.params;
        const payload = req.body;
        logger.info('Update intervenant attempt', { intervenantId: id, requesterId: req.user?.id });
        
        const updated = await intervenantsService.update(id, payload);
        if (!updated) {
            logger.warn('Update intervenant failed: not found', { intervenantId: id });
            return res.status(404).json({ success: false, message: 'Intervenant non trouvé.' });
        }
        
        logger.info('Intervenant updated successfully', { intervenantId: id });
        res.json({ success: true, data: updated });
    } catch (err) {
        logger.error('Update intervenant error', { intervenantId: req.params.id, error: err.message });
        next(err);
    }
}

/**
 * PATCH /api/v1/intervenants/:id/status
 * Changer le statut d'un intervenant (pending, approved, rejected)
 */
export async function updateIntervenantStatus(req, res, next) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        logger.info('Update intervenant status', { intervenantId: id, newStatus: status, requesterId: req.user?.id });
        
        const updated = await intervenantsService.updateStatus(id, status);
        if (!updated) {
            logger.warn('Update intervenant status failed: not found', { intervenantId: id });
            return res.status(404).json({ success: false, message: 'Intervenant non trouvé.' });
        }
        
        logger.info('Intervenant status updated successfully', { intervenantId: id, newStatus: status });
        res.json({ success: true, data: updated });
    } catch (err) {
        logger.error('Update intervenant status error', { intervenantId: req.params.id, error: err.message });
        next(err);
    }
}

/**
 * GET /api/v1/intervenants/:id/documents
 * Lister les documents d'un intervenant
 */
export async function getDocuments(req, res, next) {
    try {
        const { id } = req.params;
        logger.info('Get intervenant documents', { intervenantId: id, requesterId: req.user?.id });
        
        const documents = await intervenantsService.getDocuments(id);
        logger.info('Intervenant documents retrieved', { intervenantId: id, count: documents.length });
        res.json({ success: true, data: documents });
    } catch (err) {
        logger.error('Get intervenant documents error', { intervenantId: req.params.id, error: err.message });
        next(err);
    }
}

/**
 * POST /api/v1/intervenants/:id/documents
 * Ajouter un document à un intervenant (CDC MVP - sans chiffrement)
 */
export async function uploadDocument(req, res, next) {
    try {
        const { id } = req.params;
        const { fileName, filePath, type } = req.body;
        logger.info('Upload intervenant document', { intervenantId: id, fileName, type, requesterId: req.user?.id });
        
        const doc = await intervenantsService.addDocument(id, {
            fileName,
            filePath,
            type
        });

        logger.info('Intervenant document uploaded successfully', { intervenantId: id, documentId: doc.id });
        res.status(201).json({ success: true, data: doc });
    } catch (err) {
        logger.error('Upload intervenant document error', { intervenantId: req.params.id, error: err.message });
        next(err);
    }
}

/**
 * DELETE /api/v1/intervenants/:id/documents/:docId
 * Supprimer un document
 */
export async function deleteDocument(req, res, next) {
    try {
        const { id, docId } = req.params;
        logger.info('Delete intervenant document', { intervenantId: id, documentId: docId, requesterId: req.user?.id });
        
        await intervenantsService.deleteDocument(id, docId);
        logger.info('Intervenant document deleted successfully', { intervenantId: id, documentId: docId });
        res.json({ success: true, message: 'Document supprimé.' });
    } catch (err) {
        logger.error('Delete intervenant document error', { intervenantId: req.params.id, documentId: req.params.docId, error: err.message });
        next(err);
    }
}
