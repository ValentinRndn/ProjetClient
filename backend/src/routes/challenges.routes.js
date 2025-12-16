/**
 * Routes API pour les Challenges pédagogiques
 */

import express from 'express';
import { verifyToken, checkRole } from '../middlewares/auth.middleware.js';
import * as challengesService from '../services/challenges.service.js';

const router = express.Router();

// ============================================
// Routes publiques
// ============================================

/**
 * GET /api/challenges/public
 * Récupérer tous les challenges approuvés (public)
 */
router.get('/public', async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.thematique) filters.thematique = req.query.thematique;

    const challenges = await challengesService.getPublicChallenges(filters);
    res.json(challenges);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/challenges/public/:id
 * Récupérer un challenge approuvé par ID (public)
 */
router.get('/public/:id', async (req, res, next) => {
  try {
    const challenge = await challengesService.getChallengeById(req.params.id);

    // Vérifier que le challenge est approuvé pour l'accès public
    if (challenge.status !== 'approved') {
      return res.status(404).json({ error: 'Challenge non trouvé' });
    }

    res.json(challenge);
  } catch (err) {
    next(err);
  }
});

// ============================================
// Routes authentifiées (Intervenants)
// ============================================

/**
 * POST /api/challenges
 * Créer un nouveau challenge (intervenant uniquement)
 */
router.post('/', verifyToken, checkRole(['INTERVENANT']), async (req, res, next) => {
  try {
    const challenge = await challengesService.createChallenge(req.body, req.user.id);
    res.status(201).json(challenge);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/challenges/my
 * Récupérer mes challenges (intervenant)
 */
router.get('/my', verifyToken, checkRole(['INTERVENANT']), async (req, res, next) => {
  try {
    const challenges = await challengesService.getMyChallenges(req.user.id);
    res.json(challenges);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/challenges/:id
 * Récupérer un challenge par ID (authentifié)
 */
router.get('/:id', verifyToken, async (req, res, next) => {
  try {
    const challenge = await challengesService.getChallengeById(
      req.params.id,
      req.user.id,
      req.user.role
    );
    res.json(challenge);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/challenges/:id
 * Mettre à jour un challenge (propriétaire ou admin)
 */
router.put('/:id', verifyToken, async (req, res, next) => {
  try {
    const challenge = await challengesService.updateChallenge(
      req.params.id,
      req.body,
      req.user.id,
      req.user.role
    );
    res.json(challenge);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/challenges/:id
 * Supprimer un challenge (propriétaire ou admin)
 */
router.delete('/:id', verifyToken, async (req, res, next) => {
  try {
    await challengesService.deleteChallenge(req.params.id, req.user.id, req.user.role);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// ============================================
// Routes Admin
// ============================================

/**
 * GET /api/challenges/admin/all
 * Récupérer tous les challenges (admin)
 */
router.get('/admin/all', verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.thematique) filters.thematique = req.query.thematique;

    const challenges = await challengesService.getAllChallenges(filters);
    res.json(challenges);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/challenges/admin/stats
 * Statistiques des challenges (admin)
 */
router.get('/admin/stats', verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
  try {
    const stats = await challengesService.getChallengeStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/challenges/admin/:id/approve
 * Approuver un challenge (admin)
 */
router.post('/admin/:id/approve', verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
  try {
    const challenge = await challengesService.approveChallenge(req.params.id);
    res.json(challenge);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/challenges/admin/:id/reject
 * Rejeter un challenge (admin)
 */
router.post('/admin/:id/reject', verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
  try {
    const { reason } = req.body;
    const challenge = await challengesService.rejectChallenge(req.params.id, reason);
    res.json(challenge);
  } catch (err) {
    next(err);
  }
});

export default router;
