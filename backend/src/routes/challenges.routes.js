import { Router } from 'express';
import {
  listChallenges,
  getChallenge,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  submitFeedback,
  activateChallenge,
  deactivateChallenge
} from '../controllers/challenges.controller.js';

import auth from '../middlewares/auth.middleware.js';
import hasRole from '../middlewares/hasRole.middleware.js';

const router = Router();

/**
 * Public
 * GET  /api/v1/challenges        -> liste publique (filtres, pagination)
 * GET  /api/v1/challenges/:id    -> détail challenge (public ou auth selon besoin)
 */
router.get('/', listChallenges);
router.get('/:id', getChallenge);

/**
 * Feedback / participation (auth required)
 * POST /api/v1/challenges/:id/feedback
 */
router.post('/:id/feedback', auth, submitFeedback);

/**
 * Admin / Backoffice (ADMIN / SUPER_ADMIN)
 * POST   /api/v1/challenges         -> create challenge
 * PATCH  /api/v1/challenges/:id     -> update challenge
 * DELETE /api/v1/challenges/:id     -> delete challenge
 * POST   /api/v1/challenges/:id/activate   -> mark active
 * POST   /api/v1/challenges/:id/deactivate -> mark inactive
 */
router.post('/', auth, hasRole('ADMIN', 'SUPER_ADMIN'), createChallenge);
router.patch('/:id', auth, hasRole('ADMIN', 'SUPER_ADMIN'), updateChallenge);
router.delete('/:id', auth, hasRole('ADMIN', 'SUPER_ADMIN'), deleteChallenge);

router.post('/:id/activate', auth, hasRole('ADMIN', 'SUPER_ADMIN'), activateChallenge);
router.post('/:id/deactivate', auth, hasRole('ADMIN', 'SUPER_ADMIN'), deactivateChallenge);

export default router;
