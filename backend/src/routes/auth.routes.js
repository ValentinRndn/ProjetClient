/**
 * ============================================
 * Vizion Academy - Routes d'Authentification
 * CDC Article 5 : POST /login, POST /register
 * ============================================
 */

import { Router } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import { register, login, refreshToken, logout, me } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { loginSchema, refreshTokenSchema, registerSchema } from '../validators/auth.validator.js';
import rateLimit from '../middlewares/rateLimit.middleware.js';
import prisma from '../../prisma.js';
import logger from '../utils/logger.js';
import { sendEmail, createNotification, NotificationTypes } from '../services/email.service.js';

// Schemas de validation pour reset password
const forgotPasswordSchema = { body: Joi.object({ email: Joi.string().email().required() }) };
const resetPasswordSchema = {
    body: Joi.object({
        token: Joi.string().required(),
        password: Joi.string().min(8).required(),
    }),
};

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

/**
 * POST /api/v1/auth/forgot-password
 * Demande de réinitialisation de mot de passe
 */
router.post('/forgot-password', validate(forgotPasswordSchema), rateLimit({ limit: 3, windowMs: 60_000 }), async (req, res, next) => {
    try {
        const { email } = req.body;

        // Chercher l'utilisateur
        const user = await prisma.user.findUnique({ where: { email } });

        // Toujours répondre la même chose pour éviter l'énumération
        if (!user) {
            logger.info('Password reset requested for non-existent email', { email });
            return res.json({
                success: true,
                message: 'Si cette adresse existe, un email de réinitialisation a été envoyé.',
            });
        }

        // Invalider les anciens tokens
        await prisma.passwordResetToken.updateMany({
            where: { userId: user.id, usedAt: null },
            data: { usedAt: new Date() },
        });

        // Créer un nouveau token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

        await prisma.passwordResetToken.create({
            data: {
                token,
                userId: user.id,
                expiresAt,
            },
        });

        // URL de réinitialisation (frontend)
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

        // Envoyer l'email
        await sendEmail(
            email,
            'Réinitialisation de votre mot de passe - Vizion Academy',
            `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 30px; text-align: center;">
                    <h1 style="color: white; margin: 0;">Vizion Academy</h1>
                </div>
                <div style="padding: 30px; background: #ffffff;">
                    <h2 style="color: #1F2937; margin-top: 0;">Réinitialisation de mot de passe</h2>
                    <p style="color: #4B5563; line-height: 1.6;">
                        Vous avez demandé la réinitialisation de votre mot de passe.
                        Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}"
                           style="background: #4F46E5; color: white; padding: 12px 30px;
                                  text-decoration: none; border-radius: 8px; display: inline-block;">
                            Réinitialiser mon mot de passe
                        </a>
                    </div>
                    <p style="color: #9CA3AF; font-size: 14px;">
                        Ce lien expire dans 1 heure.<br>
                        Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
                    </p>
                </div>
                <div style="padding: 20px; background: #F3F4F6; text-align: center;">
                    <p style="color: #6B7280; font-size: 12px; margin: 0;">
                        Vizion Academy - Plateforme de mise en relation écoles-intervenants
                    </p>
                </div>
            </div>
            `
        );

        logger.info('Password reset email sent', { email, userId: user.id });

        res.json({
            success: true,
            message: 'Si cette adresse existe, un email de réinitialisation a été envoyé.',
        });
    } catch (error) {
        logger.error('Error in forgot password', { error: error.message });
        next(error);
    }
});

/**
 * POST /api/v1/auth/reset-password
 * Réinitialisation du mot de passe avec le token
 */
router.post('/reset-password', validate(resetPasswordSchema), async (req, res, next) => {
    try {
        const { token, password } = req.body;

        // Chercher le token valide
        const resetToken = await prisma.passwordResetToken.findFirst({
            where: {
                token,
                usedAt: null,
                expiresAt: { gt: new Date() },
            },
            include: { user: true },
        });

        if (!resetToken) {
            return res.status(400).json({
                success: false,
                message: 'Token invalide ou expiré. Veuillez refaire une demande.',
            });
        }

        // Hasher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Mettre à jour le mot de passe et marquer le token comme utilisé
        await prisma.$transaction([
            prisma.user.update({
                where: { id: resetToken.userId },
                data: { password: hashedPassword },
            }),
            prisma.passwordResetToken.update({
                where: { id: resetToken.id },
                data: { usedAt: new Date() },
            }),
        ]);

        // Créer une notification
        await createNotification(
            resetToken.userId,
            NotificationTypes.PASSWORD_RESET,
            'Mot de passe modifié',
            'Votre mot de passe a été modifié avec succès. Si vous n\'êtes pas à l\'origine de cette modification, contactez-nous immédiatement.',
            null,
            true
        );

        logger.info('Password reset successful', { userId: resetToken.userId });

        res.json({
            success: true,
            message: 'Mot de passe modifié avec succès. Vous pouvez maintenant vous connecter.',
        });
    } catch (error) {
        logger.error('Error in reset password', { error: error.message });
        next(error);
    }
});

/**
 * GET /api/v1/auth/verify-reset-token/:token
 * Vérifie si un token de réinitialisation est valide
 */
router.get('/verify-reset-token/:token', async (req, res) => {
    try {
        const { token } = req.params;

        const resetToken = await prisma.passwordResetToken.findFirst({
            where: {
                token,
                usedAt: null,
                expiresAt: { gt: new Date() },
            },
        });

        res.json({
            success: true,
            valid: !!resetToken,
        });
    } catch (error) {
        logger.error('Error verifying reset token', { error: error.message });
        res.json({ success: true, valid: false });
    }
});

export default router;