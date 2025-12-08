/**
 * ============================================
 * Vizion Academy - Routes d'Authentification
 * CDC Article 5 : POST /login, POST /register
 * ============================================
 */

import { Router } from 'express';
import { register, login, refreshToken, logout, me } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { loginSchema, refreshTokenSchema, registerSchema } from '../validators/auth.validator.js';
import rateLimit from '../middlewares/rateLimit.middleware.js';

const router = Router();

/**
 * POST /api/v1/auth/register
 * Inscription d'un nouvel utilisateur (CDC Article 5)
 * Body: { email, password, role, ecoleData?, intervenantData? }
 * Reply: { success, user, accessToken, refreshToken, expiresIn }
 */
router.post('/register', validate(registerSchema), rateLimit({ limit: 5, windowMs: 60_000 }), register);

/**
 * POST /api/v1/auth/login
 * Connexion et émission du JWT (CDC Article 5)
 * Body: { email, password }
 * Reply: { success, accessToken, refreshToken, expiresIn, user }
 */
router.post('/login', validate(loginSchema), rateLimit({ limit: 5, windowMs: 60_000 }), login);

/**
 * POST /api/v1/auth/refresh
 * Rafraîchissement du token d'accès
 * Body: { refreshToken }
 * Reply: { success, accessToken, refreshToken?, expiresIn }
 */
router.post('/refresh', validate(refreshTokenSchema), refreshToken);

/**
 * POST /api/v1/auth/logout
 * Déconnexion et invalidation du refresh token
 * Body: { refreshToken? }
 */
router.post('/logout', logout);

/**
 * GET /api/v1/auth/me
 * Récupérer le profil de l'utilisateur connecté
 * Protected route
 */
router.get('/me', verifyToken, me);

export default router;