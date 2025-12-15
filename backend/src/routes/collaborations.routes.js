/**
 * Routes pour la gestion des collaborations
 */

import { Router } from 'express';
import { verifyToken, checkRole } from '../middlewares/auth.middleware.js';
import * as collaborationsService from '../services/collaborations.service.js';

const router = Router();

// ========================================
// ROUTES
// ========================================

/**
 * GET /api/collaborations
 * Récupérer mes collaborations
 */
router.get(
  '/',
  verifyToken,
  checkRole(['ECOLE', 'INTERVENANT']),
  async (req, res, next) => {
    try {
      const { status } = req.query;
      const result = await collaborationsService.getMyCollaborations(
        req.user.id,
        req.user.role,
        { status }
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/collaborations/search/ecoles
 * Rechercher des écoles (pour les intervenants)
 */
router.get(
  '/search/ecoles',
  verifyToken,
  checkRole(['INTERVENANT']),
  async (req, res, next) => {
    try {
      const query = req.query.q || '';
      if (query.length < 1) {
        return res.json([]);
      }
      const ecoles = await collaborationsService.searchEcoles(query);
      res.json(ecoles);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/collaborations/search/intervenants
 * Rechercher des intervenants (pour les écoles)
 */
router.get(
  '/search/intervenants',
  verifyToken,
  checkRole(['ECOLE']),
  async (req, res, next) => {
    try {
      const query = req.query.q || '';
      if (query.length < 1) {
        return res.json([]);
      }
      const intervenants = await collaborationsService.searchIntervenants(query);
      res.json(intervenants);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/collaborations/:id
 * Récupérer une collaboration par ID
 */
router.get(
  '/:id',
  verifyToken,
  checkRole(['ECOLE', 'INTERVENANT', 'ADMIN']),
  async (req, res, next) => {
    try {
      const collaboration = await collaborationsService.getCollaborationById(
        req.params.id,
        req.user.id,
        req.user.role
      );
      res.json(collaboration);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/collaborations
 * Créer une nouvelle collaboration
 */
router.post(
  '/',
  verifyToken,
  checkRole(['ECOLE', 'INTERVENANT']),
  async (req, res, next) => {
    try {
      const collaboration = await collaborationsService.createCollaboration(
        req.body,
        req.user.id,
        req.user.role
      );
      res.status(201).json(collaboration);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /api/collaborations/:id
 * Mettre à jour une collaboration
 */
router.put(
  '/:id',
  verifyToken,
  checkRole(['ECOLE', 'INTERVENANT', 'ADMIN']),
  async (req, res, next) => {
    try {
      const collaboration = await collaborationsService.updateCollaboration(
        req.params.id,
        req.body,
        req.user.id,
        req.user.role
      );
      res.json(collaboration);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/collaborations/:id/validate
 * Valider une collaboration (confirmer sa participation)
 */
router.post(
  '/:id/validate',
  verifyToken,
  checkRole(['ECOLE', 'INTERVENANT']),
  async (req, res, next) => {
    try {
      const collaboration = await collaborationsService.validateCollaboration(
        req.params.id,
        req.user.id,
        req.user.role
      );
      res.json(collaboration);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PATCH /api/collaborations/:id/status
 * Changer le statut d'une collaboration
 */
router.patch(
  '/:id/status',
  verifyToken,
  checkRole(['ECOLE', 'INTERVENANT', 'ADMIN']),
  async (req, res, next) => {
    try {
      const collaboration = await collaborationsService.updateCollaborationStatus(
        req.params.id,
        req.body.status,
        req.user.id,
        req.user.role
      );
      res.json(collaboration);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/collaborations/:id
 * Supprimer une collaboration
 */
router.delete(
  '/:id',
  verifyToken,
  checkRole(['ECOLE', 'INTERVENANT', 'ADMIN']),
  async (req, res, next) => {
    try {
      const result = await collaborationsService.deleteCollaboration(
        req.params.id,
        req.user.id,
        req.user.role
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
