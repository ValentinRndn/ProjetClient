/**
 * ============================================
 * Vizion Academy - Routes Déclarations d'activité
 * URSSAF-like pour les intervenants
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
const createDeclarationSchema = Joi.object({
    periode: Joi.string().pattern(/^\d{4}-\d{2}$/).required(), // Format: 2024-01
    type: Joi.string().valid('mensuelle', 'trimestrielle').default('mensuelle'),
    chiffreAffaires: Joi.number().integer().min(0).default(0),
    nbMissions: Joi.number().integer().min(0).default(0),
    nbHeures: Joi.number().integer().min(0).default(0),
    fraisPro: Joi.number().integer().min(0).default(0),
    notes: Joi.string().max(1000).optional().allow(''),
});

const updateDeclarationSchema = Joi.object({
    chiffreAffaires: Joi.number().integer().min(0).optional(),
    nbMissions: Joi.number().integer().min(0).optional(),
    nbHeures: Joi.number().integer().min(0).optional(),
    fraisPro: Joi.number().integer().min(0).optional(),
    notes: Joi.string().max(1000).optional().allow(''),
    status: Joi.string().valid('brouillon', 'validee').optional(),
});

const paramsSchema = Joi.object({
    id: Joi.string().uuid().required(),
});

const querySchema = Joi.object({
    annee: Joi.number().integer().min(2020).max(2100).optional(),
    status: Joi.string().valid('brouillon', 'validee', 'transmise').optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
});

// Taux de cotisations auto-entrepreneur (services)
const TAUX_COTISATIONS_SOCIALES = 0.22; // 22% pour prestations de services
const TAUX_CFP = 0.002; // 0.2% contribution formation

// Calcul des cotisations
function calculerCotisations(chiffreAffaires) {
    const cotisationsSociales = Math.round(chiffreAffaires * TAUX_COTISATIONS_SOCIALES);
    const contributionFormation = Math.round(chiffreAffaires * TAUX_CFP);
    return { cotisationsSociales, contributionFormation };
}

// ============================================
// Routes Déclarations - Intervenants uniquement
// ============================================

/**
 * GET /api/v1/declarations
 * Liste les déclarations de l'intervenant connecté
 */
router.get('/', verifyToken, checkRole(['INTERVENANT']), validate({ query: querySchema }), async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { annee, status, page, limit } = req.query;

        // Récupérer l'intervenant
        const intervenant = await prisma.intervenant.findUnique({
            where: { userId },
        });

        if (!intervenant) {
            return res.status(404).json({
                success: false,
                message: 'Profil intervenant non trouvé',
            });
        }

        // Construire les filtres
        const where = { intervenantId: intervenant.id };

        if (annee) {
            where.periode = { startsWith: String(annee) };
        }

        if (status) {
            where.status = status;
        }

        // Compter le total
        const total = await prisma.declarationActivite.count({ where });

        // Récupérer les déclarations avec pagination
        const declarations = await prisma.declarationActivite.findMany({
            where,
            orderBy: { periode: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        });

        // Calculer les totaux pour l'année
        const anneeActuelle = annee || new Date().getFullYear();
        const totaux = await prisma.declarationActivite.aggregate({
            where: {
                intervenantId: intervenant.id,
                periode: { startsWith: String(anneeActuelle) },
                status: { not: 'brouillon' },
            },
            _sum: {
                chiffreAffaires: true,
                nbMissions: true,
                nbHeures: true,
                cotisationsSociales: true,
                contributionFormation: true,
            },
        });

        logger.info('Declarations retrieved', { intervenantId: intervenant.id, count: declarations.length });

        res.json({
            success: true,
            data: declarations,
            totaux: {
                annee: anneeActuelle,
                chiffreAffaires: totaux._sum.chiffreAffaires || 0,
                nbMissions: totaux._sum.nbMissions || 0,
                nbHeures: totaux._sum.nbHeures || 0,
                cotisationsSociales: totaux._sum.cotisationsSociales || 0,
                contributionFormation: totaux._sum.contributionFormation || 0,
            },
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        logger.error('Error fetching declarations', { userId: req.user?.id, error: error.message });
        next(error);
    }
});

/**
 * GET /api/v1/declarations/:id
 * Récupérer une déclaration par ID
 */
router.get('/:id', validate({ params: paramsSchema }), verifyToken, checkRole(['INTERVENANT']), async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const intervenant = await prisma.intervenant.findUnique({
            where: { userId },
        });

        if (!intervenant) {
            return res.status(404).json({
                success: false,
                message: 'Profil intervenant non trouvé',
            });
        }

        const declaration = await prisma.declarationActivite.findUnique({
            where: { id },
        });

        if (!declaration || declaration.intervenantId !== intervenant.id) {
            return res.status(404).json({
                success: false,
                message: 'Déclaration non trouvée',
            });
        }

        res.json({
            success: true,
            data: declaration,
        });
    } catch (error) {
        logger.error('Error fetching declaration', { userId: req.user?.id, error: error.message });
        next(error);
    }
});

/**
 * POST /api/v1/declarations
 * Créer une nouvelle déclaration
 */
router.post('/', validate({ body: createDeclarationSchema }), verifyToken, checkRole(['INTERVENANT']), async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { periode, type, chiffreAffaires, nbMissions, nbHeures, fraisPro, notes } = req.body;

        const intervenant = await prisma.intervenant.findUnique({
            where: { userId },
        });

        if (!intervenant) {
            return res.status(404).json({
                success: false,
                message: 'Profil intervenant non trouvé',
            });
        }

        // Vérifier si une déclaration existe déjà pour cette période
        const existing = await prisma.declarationActivite.findUnique({
            where: {
                intervenantId_periode: {
                    intervenantId: intervenant.id,
                    periode,
                },
            },
        });

        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'Une déclaration existe déjà pour cette période',
                data: existing,
            });
        }

        // Calculer les cotisations
        const { cotisationsSociales, contributionFormation } = calculerCotisations(chiffreAffaires);

        // Créer la déclaration
        const declaration = await prisma.declarationActivite.create({
            data: {
                intervenantId: intervenant.id,
                periode,
                type,
                chiffreAffaires,
                nbMissions,
                nbHeures,
                fraisPro,
                cotisationsSociales,
                contributionFormation,
                notes,
                status: 'brouillon',
            },
        });

        logger.info('Declaration created', { intervenantId: intervenant.id, periode });

        res.status(201).json({
            success: true,
            message: 'Déclaration créée avec succès',
            data: declaration,
        });
    } catch (error) {
        logger.error('Error creating declaration', { userId: req.user?.id, error: error.message });
        next(error);
    }
});

/**
 * PATCH /api/v1/declarations/:id
 * Mettre à jour une déclaration (si brouillon)
 */
router.patch('/:id', validate({ params: paramsSchema, body: updateDeclarationSchema }), verifyToken, checkRole(['INTERVENANT']), async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { chiffreAffaires, nbMissions, nbHeures, fraisPro, notes, status } = req.body;

        const intervenant = await prisma.intervenant.findUnique({
            where: { userId },
        });

        if (!intervenant) {
            return res.status(404).json({
                success: false,
                message: 'Profil intervenant non trouvé',
            });
        }

        // Récupérer la déclaration existante
        const existing = await prisma.declarationActivite.findUnique({
            where: { id },
        });

        if (!existing || existing.intervenantId !== intervenant.id) {
            return res.status(404).json({
                success: false,
                message: 'Déclaration non trouvée',
            });
        }

        // Vérifier que la déclaration est modifiable
        if (existing.status === 'transmise') {
            return res.status(400).json({
                success: false,
                message: 'Une déclaration transmise ne peut plus être modifiée',
            });
        }

        // Préparer les données de mise à jour
        const updateData = {};

        if (chiffreAffaires !== undefined) {
            updateData.chiffreAffaires = chiffreAffaires;
            // Recalculer les cotisations
            const cotisations = calculerCotisations(chiffreAffaires);
            updateData.cotisationsSociales = cotisations.cotisationsSociales;
            updateData.contributionFormation = cotisations.contributionFormation;
        }

        if (nbMissions !== undefined) updateData.nbMissions = nbMissions;
        if (nbHeures !== undefined) updateData.nbHeures = nbHeures;
        if (fraisPro !== undefined) updateData.fraisPro = fraisPro;
        if (notes !== undefined) updateData.notes = notes;

        if (status) {
            updateData.status = status;
            if (status === 'validee') {
                updateData.validatedAt = new Date();
            }
        }

        // Mettre à jour
        const declaration = await prisma.declarationActivite.update({
            where: { id },
            data: updateData,
        });

        logger.info('Declaration updated', { intervenantId: intervenant.id, declarationId: id });

        res.json({
            success: true,
            message: 'Déclaration mise à jour',
            data: declaration,
        });
    } catch (error) {
        logger.error('Error updating declaration', { userId: req.user?.id, error: error.message });
        next(error);
    }
});

/**
 * DELETE /api/v1/declarations/:id
 * Supprimer une déclaration (si brouillon)
 */
router.delete('/:id', validate({ params: paramsSchema }), verifyToken, checkRole(['INTERVENANT']), async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const intervenant = await prisma.intervenant.findUnique({
            where: { userId },
        });

        if (!intervenant) {
            return res.status(404).json({
                success: false,
                message: 'Profil intervenant non trouvé',
            });
        }

        const existing = await prisma.declarationActivite.findUnique({
            where: { id },
        });

        if (!existing || existing.intervenantId !== intervenant.id) {
            return res.status(404).json({
                success: false,
                message: 'Déclaration non trouvée',
            });
        }

        if (existing.status !== 'brouillon') {
            return res.status(400).json({
                success: false,
                message: 'Seules les déclarations en brouillon peuvent être supprimées',
            });
        }

        await prisma.declarationActivite.delete({
            where: { id },
        });

        logger.info('Declaration deleted', { intervenantId: intervenant.id, declarationId: id });

        res.json({
            success: true,
            message: 'Déclaration supprimée',
        });
    } catch (error) {
        logger.error('Error deleting declaration', { userId: req.user?.id, error: error.message });
        next(error);
    }
});

/**
 * POST /api/v1/declarations/:id/valider
 * Valider une déclaration
 */
router.post('/:id/valider', validate({ params: paramsSchema }), verifyToken, checkRole(['INTERVENANT']), async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const intervenant = await prisma.intervenant.findUnique({
            where: { userId },
        });

        if (!intervenant) {
            return res.status(404).json({
                success: false,
                message: 'Profil intervenant non trouvé',
            });
        }

        const existing = await prisma.declarationActivite.findUnique({
            where: { id },
        });

        if (!existing || existing.intervenantId !== intervenant.id) {
            return res.status(404).json({
                success: false,
                message: 'Déclaration non trouvée',
            });
        }

        if (existing.status !== 'brouillon') {
            return res.status(400).json({
                success: false,
                message: 'Cette déclaration a déjà été validée',
            });
        }

        const declaration = await prisma.declarationActivite.update({
            where: { id },
            data: {
                status: 'validee',
                validatedAt: new Date(),
            },
        });

        logger.info('Declaration validated', { intervenantId: intervenant.id, declarationId: id });

        res.json({
            success: true,
            message: 'Déclaration validée avec succès',
            data: declaration,
        });
    } catch (error) {
        logger.error('Error validating declaration', { userId: req.user?.id, error: error.message });
        next(error);
    }
});

export default router;
