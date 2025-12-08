import { Router } from 'express';
import auth from '../middlewares/auth.middleware.js';
import hasRole from '../middlewares/hasRole.middleware.js';

import {
  trackEvent,
  trackPageView,
  trackAction,
  listEvents,
  getEvent
} from '../controllers/tracking.controller.js';

const router = Router();

/**
 * PUBLIC tracking endpoints
 * Ces endpoints peuvent être appelés par ton front web, mobile, widget, etc.
 *
 * POST /tracking/event      -> event custom
 * POST /tracking/pageview   -> page vue
 * POST /tracking/action     -> action utilisateur (peut être auth obligatoire)
 */

router.post('/event', trackEvent);
router.post('/pageview', trackPageView);

// Action : à toi de choisir si tu veux forcer auth ici.
router.post('/action', auth, trackAction);

/**
 * ADMIN ONLY — consulter les logs de tracking
 */

router.get(
  '/',
  auth,
  hasRole('ADMIN', 'SUPER_ADMIN'),
  listEvents
);

router.get(
  '/:id',
  auth,
  hasRole('ADMIN', 'SUPER_ADMIN'),
  getEvent
);

export default router;
