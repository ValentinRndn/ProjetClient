/**
 * ============================================
 * Vizion Academy - Routes Favoris (École)
 * Gestion des intervenants favoris des écoles
 * ============================================
 */

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken, checkRole } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import Joi from 'joi';
import logger from '../utils/logger.js';

const router = Router();
const prisma = new PrismaClient();

// Schemas de validation
const addFavoriteSchema = Joi.object({
    intervenantId: Joi.string().uuid().required(),
    note: Joi.string().max(500).optional().allow(''),
});

const updateFavoriteSchema = Joi.object({
    note: Joi.string().max(500).optional().allow(''),
});

const paramsSchema = Joi.object({
    intervenantId: Joi.string().uuid().required(),
});

// ============================================
// Routes Favoris - École uniquement
// ============================================

/**
 * GET /api/v1/favorites
 * Liste tous les favoris de l'école connectée
 */
router.get('/', verifyToken, checkRole(['ECOLE']), async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Récupérer l'école de l'utilisateur
        const ecole = await prisma.ecole.findUnique({
            where: { userId },
        });

        if (!ecole) {
            return res.status(404).json({
                success: false,
                message: 'École non trouvée',
            });
        }

        const favorites = await prisma.ecoleFavorite.findMany({
            where: { ecoleId: ecole.id },
            include: {
                intervenant: {
                    include: {
                        user: {
                            select: { email: true },
                        },
                        documents: {
                            select: {
                                id: true,
                                fileName: true,
                                type: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        logger.info('Favorites retrieved', { ecoleId: ecole.id, count: favorites.length });

        res.json({
            success: true,
            data: favorites,
            total: favorites.length,
        });
    } catch (error) {
        logger.error('Error fetching favorites', { userId: req.user?.id, error: error.message });
        next(error);
    }
});

/**
 * POST /api/v1/favorites
 * Ajouter un intervenant aux favoris
 */
router.post('/', validate({ body: addFavoriteSchema }), verifyToken, checkRole(['ECOLE']), async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { intervenantId, note } = req.body;

        // Récupérer l'école de l'utilisateur
        const ecole = await prisma.ecole.findUnique({
            where: { userId },
        });

        if (!ecole) {
            return res.status(404).json({
                success: false,
                message: 'École non trouvée',
            });
        }

        // Vérifier que l'intervenant existe
        const intervenant = await prisma.intervenant.findUnique({
            where: { id: intervenantId },
        });

        if (!intervenant) {
            return res.status(404).json({
                success: false,
                message: 'Intervenant non trouvé',
            });
        }

        // Vérifier si déjà en favoris
        const existing = await prisma.ecoleFavorite.findUnique({
            where: {
                ecoleId_intervenantId: {
                    ecoleId: ecole.id,
                    intervenantId,
                },
            },
        });

        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'Cet intervenant est déjà dans vos favoris',
            });
        }

        // Créer le favori
        const favorite = await prisma.ecoleFavorite.create({
            data: {
                ecoleId: ecole.id,
                intervenantId,
                note: note || null,
            },
            include: {
                intervenant: {
                    include: {
                        user: {
                            select: { email: true },
                        },
                    },
                },
            },
        });

        logger.info('Favorite added', { ecoleId: ecole.id, intervenantId });

        res.status(201).json({
            success: true,
            message: 'Intervenant ajouté aux favoris',
            data: favorite,
        });
    } catch (error) {
        logger.error('Error adding favorite', { userId: req.user?.id, error: error.message });
        next(error);
    }
});

/**
 * GET /api/v1/favorites/check/:intervenantId
 * Vérifier si un intervenant est dans les favoris
 */
router.get('/check/:intervenantId', validate({ params: paramsSchema }), verifyToken, checkRole(['ECOLE']), async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { intervenantId } = req.params;

        const ecole = await prisma.ecole.findUnique({
            where: { userId },
        });

        if (!ecole) {
            return res.status(404).json({
                success: false,
                message: 'École non trouvée',
            });
        }

        const favorite = await prisma.ecoleFavorite.findUnique({
            where: {
                ecoleId_intervenantId: {
                    ecoleId: ecole.id,
                    intervenantId,
                },
            },
        });

        res.json({
            success: true,
            isFavorite: !!favorite,
            data: favorite,
        });
    } catch (error) {
        logger.error('Error checking favorite', { userId: req.user?.id, error: error.message });
        next(error);
    }
});

/**
 * PATCH /api/v1/favorites/:intervenantId
 * Mettre à jour la note d'un favori
 */
router.patch('/:intervenantId', validate({ params: paramsSchema, body: updateFavoriteSchema }), verifyToken, checkRole(['ECOLE']), async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { intervenantId } = req.params;
        const { note } = req.body;

        const ecole = await prisma.ecole.findUnique({
            where: { userId },
        });

        if (!ecole) {
            return res.status(404).json({
                success: false,
                message: 'École non trouvée',
            });
        }

        const favorite = await prisma.ecoleFavorite.update({
            where: {
                ecoleId_intervenantId: {
                    ecoleId: ecole.id,
                    intervenantId,
                },
            },
            data: { note },
            include: {
                intervenant: {
                    include: {
                        user: {
                            select: { email: true },
                        },
                    },
                },
            },
        });

        logger.info('Favorite note updated', { ecoleId: ecole.id, intervenantId });

        res.json({
            success: true,
            message: 'Note mise à jour',
            data: favorite,
        });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: 'Favori non trouvé',
            });
        }
        logger.error('Error updating favorite', { userId: req.user?.id, error: error.message });
        next(error);
    }
});

/**
 * DELETE /api/v1/favorites/:intervenantId
 * Retirer un intervenant des favoris
 */
router.delete('/:intervenantId', validate({ params: paramsSchema }), verifyToken, checkRole(['ECOLE']), async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { intervenantId } = req.params;

        const ecole = await prisma.ecole.findUnique({
            where: { userId },
        });

        if (!ecole) {
            return res.status(404).json({
                success: false,
                message: 'École non trouvée',
            });
        }

        await prisma.ecoleFavorite.delete({
            where: {
                ecoleId_intervenantId: {
                    ecoleId: ecole.id,
                    intervenantId,
                },
            },
        });

        logger.info('Favorite removed', { ecoleId: ecole.id, intervenantId });

        res.json({
            success: true,
            message: 'Intervenant retiré des favoris',
        });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: 'Favori non trouvé',
            });
        }
        logger.error('Error removing favorite', { userId: req.user?.id, error: error.message });
        next(error);
    }
});

export default router;
