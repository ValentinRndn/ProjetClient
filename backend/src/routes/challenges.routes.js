/**
 * Routes API pour les Challenges pédagogiques
 * - Seuls les admins peuvent créer/modifier/supprimer
 * - Système de brouillon (draft) / publié (published)
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
 * Récupérer tous les challenges publiés (public)
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
 * Récupérer un challenge publié par ID (public)
 */
router.get('/public/:id', async (req, res, next) => {
  try {
    const challenge = await challengesService.getChallengeById(req.params.id);

    // Vérifier que le challenge est publié pour l'accès public
    if (challenge.status !== 'published') {
      return res.status(404).json({ error: 'Challenge non trouvé' });
    }

    res.json(challenge);
  } catch (err) {
    next(err);
  }
});

// ============================================
// Routes Admin uniquement
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
 * POST /api/challenges/admin
 * Créer un nouveau challenge (admin uniquement)
 */
router.post('/admin', verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
  try {
    const challenge = await challengesService.createChallenge(req.body);
    res.status(201).json(challenge);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/challenges/admin/:id
 * Récupérer un challenge par ID (admin - peut voir les brouillons)
 */
router.get('/admin/:id', verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
  try {
    const challenge = await challengesService.getChallengeById(req.params.id, 'ADMIN');
    res.json(challenge);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/challenges/admin/:id
 * Mettre à jour un challenge (admin uniquement)
 */
router.put('/admin/:id', verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
  try {
    const challenge = await challengesService.updateChallenge(req.params.id, req.body);
    res.json(challenge);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/challenges/admin/:id
 * Supprimer un challenge (admin uniquement)
 */
router.delete('/admin/:id', verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
  try {
    await challengesService.deleteChallenge(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/challenges/admin/:id/publish
 * Publier un challenge (admin)
 */
router.post('/admin/:id/publish', verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
  try {
    const challenge = await challengesService.publishChallenge(req.params.id);
    res.json(challenge);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/challenges/admin/:id/unpublish
 * Dépublier un challenge (passer en brouillon) (admin)
 */
router.post('/admin/:id/unpublish', verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
  try {
    const challenge = await challengesService.unpublishChallenge(req.params.id);
    res.json(challenge);
  } catch (err) {
    next(err);
  }
});

export default router;
