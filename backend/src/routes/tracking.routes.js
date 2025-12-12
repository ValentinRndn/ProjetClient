/**
 * ============================================
 * Vizion Academy - Routes Tracking
 * Suivi des consultations de profils
 * ============================================
 */

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken, checkRole, optionalAuth } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import Joi from 'joi';
import logger from '../utils/logger.js';

const router = Router();
const prisma = new PrismaClient();

// Schemas de validation
const trackConsultationSchema = Joi.object({
    intervenantId: Joi.string().uuid().required(),
    source: Joi.string().valid('profil', 'liste', 'recherche', 'mission').default('profil'),
    duration: Joi.number().integer().min(0).optional(),
});

const querySchema = Joi.object({
    intervenantId: Joi.string().uuid().optional(),
    ecoleId: Joi.string().uuid().optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    source: Joi.string().valid('profil', 'liste', 'recherche', 'mission').optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
});

const paramsSchema = Joi.object({
    id: Joi.string().uuid().required(),
});

/**
 * POST /api/v1/tracking/consultation
 * Enregistre une consultation de profil
 */
router.post('/consultation', optionalAuth, validate({ body: trackConsultationSchema }), async (req, res, next) => {
    try {
        const { intervenantId, source, duration } = req.body;
        const userId = req.user?.id || null;
        const userRole = req.user?.role || null;

        // Récupérer l'école si c'est un user école
        let ecoleId = null;
        if (userRole === 'ECOLE') {
            const ecole = await prisma.ecole.findUnique({ where: { userId } });
            ecoleId = ecole?.id || null;
        }

        // Vérifier que l'intervenant existe
        const intervenant = await prisma.intervenant.findUnique({
            where: { id: intervenantId },
        });
        if (!intervenant) {
            return res.status(404).json({ success: false, message: 'Intervenant non trouvé' });
        }

        // Créer l'enregistrement
        const consultation = await prisma.profilConsultation.create({
            data: {
                intervenantId,
                ecoleId,
                userId,
                source,
                duration,
                ipAddress: req.ip || req.connection?.remoteAddress,
                userAgent: req.headers['user-agent'],
                referer: req.headers.referer || req.headers.referrer,
            },
        });

        logger.info('Profile consultation tracked', {
            consultationId: consultation.id,
            intervenantId,
            ecoleId,
            source,
        });

        res.status(201).json({
            success: true,
            message: 'Consultation enregistrée',
            data: { id: consultation.id },
        });
    } catch (error) {
        logger.error('Error tracking consultation', { error: error.message });
        next(error);
    }
});

/**
 * GET /api/v1/tracking/consultations
 * Liste les consultations (admin ou intervenant pour ses propres stats)
 */
router.get('/consultations', verifyToken, validate({ query: querySchema }), async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const { intervenantId, ecoleId, startDate, endDate, source, page, limit } = req.query;

        // Construire les filtres
        const where = {};

        if (userRole === 'INTERVENANT') {
            // Un intervenant ne voit que ses propres consultations
            const intervenant = await prisma.intervenant.findUnique({ where: { userId } });
            if (!intervenant) {
                return res.status(404).json({ success: false, message: 'Profil intervenant non trouvé' });
            }
            where.intervenantId = intervenant.id;
        } else if (userRole === 'ECOLE') {
            // Une école voit les consultations qu'elle a faites
            const ecole = await prisma.ecole.findUnique({ where: { userId } });
            if (!ecole) {
                return res.status(404).json({ success: false, message: 'Profil école non trouvé' });
            }
            where.ecoleId = ecole.id;
        }
        // ADMIN voit tout

        if (intervenantId && userRole === 'ADMIN') where.intervenantId = intervenantId;
        if (ecoleId && userRole === 'ADMIN') where.ecoleId = ecoleId;
        if (source) where.source = source;

        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = new Date(startDate);
            if (endDate) where.createdAt.lte = new Date(endDate);
        }

        const total = await prisma.profilConsultation.count({ where });
        const consultations = await prisma.profilConsultation.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
            include: {
                intervenant: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true,
                    },
                },
                ecole: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        res.json({
            success: true,
            data: consultations,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        logger.error('Error fetching consultations', { error: error.message });
        next(error);
    }
});

/**
 * GET /api/v1/tracking/stats/intervenant/:id
 * Statistiques de consultation pour un intervenant
 */
router.get('/stats/intervenant/:id', validate({ params: paramsSchema }), verifyToken, async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Vérifier les droits
        if (userRole === 'INTERVENANT') {
            const intervenant = await prisma.intervenant.findUnique({ where: { userId } });
            if (!intervenant || intervenant.id !== id) {
                return res.status(403).json({ success: false, message: 'Accès non autorisé' });
            }
        } else if (userRole !== 'ADMIN') {
            return res.status(403).json({ success: false, message: 'Accès non autorisé' });
        }

        // Stats globales
        const totalConsultations = await prisma.profilConsultation.count({
            where: { intervenantId: id },
        });

        // Consultations des 30 derniers jours
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const last30Days = await prisma.profilConsultation.count({
            where: {
                intervenantId: id,
                createdAt: { gte: thirtyDaysAgo },
            },
        });

        // Consultations des 7 derniers jours
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const last7Days = await prisma.profilConsultation.count({
            where: {
                intervenantId: id,
                createdAt: { gte: sevenDaysAgo },
            },
        });

        // Consultations par source
        const bySource = await prisma.profilConsultation.groupBy({
            by: ['source'],
            where: { intervenantId: id },
            _count: { id: true },
        });

        // Top écoles consultantes
        const topEcoles = await prisma.profilConsultation.groupBy({
            by: ['ecoleId'],
            where: {
                intervenantId: id,
                ecoleId: { not: null },
            },
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 10,
        });

        // Récupérer les noms des écoles
        const ecoleIds = topEcoles.map(e => e.ecoleId).filter(Boolean);
        const ecoles = await prisma.ecole.findMany({
            where: { id: { in: ecoleIds } },
            select: { id: true, name: true },
        });
        const ecoleMap = new Map(ecoles.map(e => [e.id, e.name]));

        // Consultations par jour (7 derniers jours)
        const dailyStats = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const count = await prisma.profilConsultation.count({
                where: {
                    intervenantId: id,
                    createdAt: { gte: date, lt: nextDate },
                },
            });

            dailyStats.push({
                date: date.toISOString().split('T')[0],
                count,
            });
        }

        res.json({
            success: true,
            data: {
                total: totalConsultations,
                last30Days,
                last7Days,
                bySource: bySource.map(s => ({
                    source: s.source,
                    count: s._count.id,
                })),
                topEcoles: topEcoles.map(e => ({
                    ecoleId: e.ecoleId,
                    ecoleName: ecoleMap.get(e.ecoleId) || 'Inconnu',
                    count: e._count.id,
                })),
                dailyStats,
            },
        });
    } catch (error) {
        logger.error('Error fetching intervenant stats', { error: error.message });
        next(error);
    }
});

/**
 * GET /api/v1/tracking/stats/global
 * Statistiques globales (admin uniquement)
 */
router.get('/stats/global', verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
    try {
        // Stats totales
        const totalConsultations = await prisma.profilConsultation.count();

        // Consultations des 30 derniers jours
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const last30Days = await prisma.profilConsultation.count({
            where: { createdAt: { gte: thirtyDaysAgo } },
        });

        // Visiteurs uniques (par IP)
        const uniqueVisitors = await prisma.profilConsultation.findMany({
            where: { createdAt: { gte: thirtyDaysAgo } },
            distinct: ['ipAddress'],
            select: { ipAddress: true },
        });

        // Par source
        const bySource = await prisma.profilConsultation.groupBy({
            by: ['source'],
            _count: { id: true },
        });

        // Top intervenants consultés
        const topIntervenants = await prisma.profilConsultation.groupBy({
            by: ['intervenantId'],
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 10,
        });

        // Récupérer les noms
        const intervenantIds = topIntervenants.map(i => i.intervenantId);
        const intervenants = await prisma.intervenant.findMany({
            where: { id: { in: intervenantIds } },
            select: { id: true, firstName: true, lastName: true },
        });
        const intervMap = new Map(intervenants.map(i => [i.id, `${i.firstName || ''} ${i.lastName || ''}`.trim()]));

        // Consultations par jour (30 derniers jours)
        const dailyStats = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const count = await prisma.profilConsultation.count({
                where: { createdAt: { gte: date, lt: nextDate } },
            });

            dailyStats.push({
                date: date.toISOString().split('T')[0],
                count,
            });
        }

        res.json({
            success: true,
            data: {
                total: totalConsultations,
                last30Days,
                uniqueVisitors: uniqueVisitors.length,
                bySource: bySource.map(s => ({
                    source: s.source,
                    count: s._count.id,
                })),
                topIntervenants: topIntervenants.map(i => ({
                    intervenantId: i.intervenantId,
                    intervenantName: intervMap.get(i.intervenantId) || 'Inconnu',
                    count: i._count.id,
                })),
                dailyStats,
            },
        });
    } catch (error) {
        logger.error('Error fetching global stats', { error: error.message });
        next(error);
    }
});

/**
 * GET /api/v1/tracking/export
 * Export CSV des consultations (admin uniquement)
 */
router.get('/export', verifyToken, checkRole(['ADMIN']), validate({ query: querySchema }), async (req, res, next) => {
    try {
        const { intervenantId, ecoleId, startDate, endDate, source } = req.query;

        const where = {};
        if (intervenantId) where.intervenantId = intervenantId;
        if (ecoleId) where.ecoleId = ecoleId;
        if (source) where.source = source;

        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = new Date(startDate);
            if (endDate) where.createdAt.lte = new Date(endDate);
        }

        const consultations = await prisma.profilConsultation.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                intervenant: {
                    select: { firstName: true, lastName: true },
                },
                ecole: {
                    select: { name: true },
                },
            },
        });

        // Générer le CSV
        const headers = ['Date', 'Intervenant', 'École', 'Source', 'Durée (s)', 'IP'];
        const rows = consultations.map(c => [
            new Date(c.createdAt).toLocaleString('fr-FR'),
            `${c.intervenant?.firstName || ''} ${c.intervenant?.lastName || ''}`.trim() || 'N/A',
            c.ecole?.name || 'Visiteur public',
            c.source,
            c.duration || 'N/A',
            c.ipAddress || 'N/A',
        ]);

        const csv = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="consultations-${new Date().toISOString().split('T')[0]}.csv"`);
        res.send('\uFEFF' + csv); // BOM pour Excel

        logger.info('Consultations exported', { count: consultations.length });
    } catch (error) {
        logger.error('Error exporting consultations', { error: error.message });
        next(error);
    }
});

export default router;
