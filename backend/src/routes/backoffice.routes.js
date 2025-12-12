/**
 * ============================================
 * Vizion Academy - Routes Back-Office
 * Gestion admin : thématiques, partenaires, témoignages, FAQ, audit
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

// ====== VALIDATION SCHEMAS ======
const paramsSchema = Joi.object({
    id: Joi.string().uuid().required(),
});

const thematiqueSchema = Joi.object({
    name: Joi.string().max(100).required(),
    slug: Joi.string().max(100).optional(),
    description: Joi.string().max(500).optional().allow(''),
    color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional().allow(''),
    icon: Joi.string().max(50).optional().allow(''),
    isActive: Joi.boolean().default(true),
    order: Joi.number().integer().min(0).default(0),
});

const ecolePartenaireSchema = Joi.object({
    name: Joi.string().max(200).required(),
    logoUrl: Joi.string().uri().optional().allow(''),
    websiteUrl: Joi.string().uri().optional().allow(''),
    description: Joi.string().max(500).optional().allow(''),
    isActive: Joi.boolean().default(true),
    order: Joi.number().integer().min(0).default(0),
});

const temoignageSchema = Joi.object({
    authorName: Joi.string().max(100).required(),
    authorRole: Joi.string().max(200).optional().allow(''),
    authorImage: Joi.string().uri().optional().allow(''),
    content: Joi.string().max(2000).required(),
    rating: Joi.number().integer().min(1).max(5).optional().allow(null),
    isActive: Joi.boolean().default(true),
    isFeatured: Joi.boolean().default(false),
    order: Joi.number().integer().min(0).default(0),
});

const faqSchema = Joi.object({
    question: Joi.string().max(500).required(),
    answer: Joi.string().max(5000).required(),
    category: Joi.string().max(50).optional().allow(''),
    isActive: Joi.boolean().default(true),
    order: Joi.number().integer().min(0).default(0),
});

// Helper pour générer un slug
function generateSlug(name) {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

// Helper pour logger les actions admin
async function logAudit(req, action, entity, entityId, oldValues = null, newValues = null) {
    try {
        await prisma.auditLog.create({
            data: {
                userId: req.user?.id,
                userEmail: req.user?.email,
                action,
                entity,
                entityId,
                oldValues,
                newValues,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
            },
        });
    } catch (error) {
        logger.error('Failed to create audit log', { error: error.message });
    }
}

// ============================================
// THEMATIQUES
// ============================================

/**
 * GET /api/v1/backoffice/thematiques
 * Liste des thématiques (public pour affichage, toutes pour admin)
 */
router.get('/thematiques', async (req, res, next) => {
    try {
        const { all } = req.query;
        const where = all === 'true' ? {} : { isActive: true };

        const thematiques = await prisma.thematique.findMany({
            where,
            orderBy: { order: 'asc' },
        });

        res.json({ success: true, data: thematiques });
    } catch (error) {
        logger.error('Error fetching thematiques', { error: error.message });
        next(error);
    }
});

/**
 * POST /api/v1/backoffice/thematiques
 */
router.post('/thematiques', validate({ body: thematiqueSchema }), verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
    try {
        const { name, description, color, icon, isActive, order } = req.body;
        const slug = req.body.slug || generateSlug(name);

        const thematique = await prisma.thematique.create({
            data: { name, slug, description, color, icon, isActive, order },
        });

        await logAudit(req, 'create', 'thematique', thematique.id, null, thematique);

        res.status(201).json({ success: true, data: thematique });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ success: false, message: 'Ce nom ou slug existe déjà' });
        }
        next(error);
    }
});

/**
 * PATCH /api/v1/backoffice/thematiques/:id
 */
router.patch('/thematiques/:id', validate({ params: paramsSchema }), verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
    try {
        const { id } = req.params;
        const existing = await prisma.thematique.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ success: false, message: 'Thématique non trouvée' });

        const thematique = await prisma.thematique.update({
            where: { id },
            data: req.body,
        });

        await logAudit(req, 'update', 'thematique', id, existing, thematique);

        res.json({ success: true, data: thematique });
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /api/v1/backoffice/thematiques/:id
 */
router.delete('/thematiques/:id', validate({ params: paramsSchema }), verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
    try {
        const { id } = req.params;
        const existing = await prisma.thematique.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ success: false, message: 'Thématique non trouvée' });

        await prisma.thematique.delete({ where: { id } });
        await logAudit(req, 'delete', 'thematique', id, existing, null);

        res.json({ success: true, message: 'Thématique supprimée' });
    } catch (error) {
        next(error);
    }
});

// ============================================
// ECOLES PARTENAIRES
// ============================================

/**
 * GET /api/v1/backoffice/partenaires
 */
router.get('/partenaires', async (req, res, next) => {
    try {
        const { all } = req.query;
        const where = all === 'true' ? {} : { isActive: true };

        const partenaires = await prisma.ecolePartenaire.findMany({
            where,
            orderBy: { order: 'asc' },
        });

        res.json({ success: true, data: partenaires });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/v1/backoffice/partenaires
 */
router.post('/partenaires', validate({ body: ecolePartenaireSchema }), verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
    try {
        const partenaire = await prisma.ecolePartenaire.create({ data: req.body });
        await logAudit(req, 'create', 'ecolePartenaire', partenaire.id, null, partenaire);

        res.status(201).json({ success: true, data: partenaire });
    } catch (error) {
        next(error);
    }
});

/**
 * PATCH /api/v1/backoffice/partenaires/:id
 */
router.patch('/partenaires/:id', validate({ params: paramsSchema }), verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
    try {
        const { id } = req.params;
        const existing = await prisma.ecolePartenaire.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ success: false, message: 'Partenaire non trouvé' });

        const partenaire = await prisma.ecolePartenaire.update({
            where: { id },
            data: req.body,
        });

        await logAudit(req, 'update', 'ecolePartenaire', id, existing, partenaire);

        res.json({ success: true, data: partenaire });
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /api/v1/backoffice/partenaires/:id
 */
router.delete('/partenaires/:id', validate({ params: paramsSchema }), verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
    try {
        const { id } = req.params;
        const existing = await prisma.ecolePartenaire.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ success: false, message: 'Partenaire non trouvé' });

        await prisma.ecolePartenaire.delete({ where: { id } });
        await logAudit(req, 'delete', 'ecolePartenaire', id, existing, null);

        res.json({ success: true, message: 'Partenaire supprimé' });
    } catch (error) {
        next(error);
    }
});

// ============================================
// TEMOIGNAGES
// ============================================

/**
 * GET /api/v1/backoffice/temoignages
 */
router.get('/temoignages', async (req, res, next) => {
    try {
        const { all, featured } = req.query;
        const where = {};
        if (all !== 'true') where.isActive = true;
        if (featured === 'true') where.isFeatured = true;

        const temoignages = await prisma.temoignage.findMany({
            where,
            orderBy: { order: 'asc' },
        });

        res.json({ success: true, data: temoignages });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/v1/backoffice/temoignages
 */
router.post('/temoignages', validate({ body: temoignageSchema }), verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
    try {
        const temoignage = await prisma.temoignage.create({ data: req.body });
        await logAudit(req, 'create', 'temoignage', temoignage.id, null, temoignage);

        res.status(201).json({ success: true, data: temoignage });
    } catch (error) {
        next(error);
    }
});

/**
 * PATCH /api/v1/backoffice/temoignages/:id
 */
router.patch('/temoignages/:id', validate({ params: paramsSchema }), verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
    try {
        const { id } = req.params;
        const existing = await prisma.temoignage.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ success: false, message: 'Témoignage non trouvé' });

        const temoignage = await prisma.temoignage.update({
            where: { id },
            data: req.body,
        });

        await logAudit(req, 'update', 'temoignage', id, existing, temoignage);

        res.json({ success: true, data: temoignage });
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /api/v1/backoffice/temoignages/:id
 */
router.delete('/temoignages/:id', validate({ params: paramsSchema }), verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
    try {
        const { id } = req.params;
        const existing = await prisma.temoignage.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ success: false, message: 'Témoignage non trouvé' });

        await prisma.temoignage.delete({ where: { id } });
        await logAudit(req, 'delete', 'temoignage', id, existing, null);

        res.json({ success: true, message: 'Témoignage supprimé' });
    } catch (error) {
        next(error);
    }
});

// ============================================
// FAQ
// ============================================

/**
 * GET /api/v1/backoffice/faq
 */
router.get('/faq', async (req, res, next) => {
    try {
        const { all, category } = req.query;
        const where = {};
        if (all !== 'true') where.isActive = true;
        if (category) where.category = category;

        const faqs = await prisma.fAQ.findMany({
            where,
            orderBy: [{ category: 'asc' }, { order: 'asc' }],
        });

        res.json({ success: true, data: faqs });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/v1/backoffice/faq/categories
 */
router.get('/faq/categories', async (req, res, next) => {
    try {
        const categories = await prisma.fAQ.findMany({
            where: { isActive: true },
            select: { category: true },
            distinct: ['category'],
        });

        res.json({
            success: true,
            data: categories.map(c => c.category).filter(Boolean),
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/v1/backoffice/faq
 */
router.post('/faq', validate({ body: faqSchema }), verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
    try {
        const faq = await prisma.fAQ.create({ data: req.body });
        await logAudit(req, 'create', 'faq', faq.id, null, faq);

        res.status(201).json({ success: true, data: faq });
    } catch (error) {
        next(error);
    }
});

/**
 * PATCH /api/v1/backoffice/faq/:id
 */
router.patch('/faq/:id', validate({ params: paramsSchema }), verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
    try {
        const { id } = req.params;
        const existing = await prisma.fAQ.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ success: false, message: 'FAQ non trouvée' });

        const faq = await prisma.fAQ.update({
            where: { id },
            data: req.body,
        });

        await logAudit(req, 'update', 'faq', id, existing, faq);

        res.json({ success: true, data: faq });
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /api/v1/backoffice/faq/:id
 */
router.delete('/faq/:id', validate({ params: paramsSchema }), verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
    try {
        const { id } = req.params;
        const existing = await prisma.fAQ.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ success: false, message: 'FAQ non trouvée' });

        await prisma.fAQ.delete({ where: { id } });
        await logAudit(req, 'delete', 'faq', id, existing, null);

        res.json({ success: true, message: 'FAQ supprimée' });
    } catch (error) {
        next(error);
    }
});

// ============================================
// AUDIT LOGS
// ============================================

/**
 * GET /api/v1/backoffice/audit-logs
 */
router.get('/audit-logs', verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
    try {
        const { userId, action, entity, startDate, endDate, page = 1, limit = 50 } = req.query;

        const where = {};
        if (userId) where.userId = userId;
        if (action) where.action = action;
        if (entity) where.entity = entity;

        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = new Date(startDate);
            if (endDate) where.createdAt.lte = new Date(endDate);
        }

        const total = await prisma.auditLog.count({ where });
        const logs = await prisma.auditLog.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
        });

        res.json({
            success: true,
            data: logs,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/v1/backoffice/audit-logs/export
 * Export CSV des logs
 */
router.get('/audit-logs/export', verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
    try {
        const { startDate, endDate, action, entity } = req.query;

        const where = {};
        if (action) where.action = action;
        if (entity) where.entity = entity;
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = new Date(startDate);
            if (endDate) where.createdAt.lte = new Date(endDate);
        }

        const logs = await prisma.auditLog.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        const headers = ['Date', 'Utilisateur', 'Action', 'Entité', 'ID Entité', 'IP'];
        const rows = logs.map(log => [
            new Date(log.createdAt).toLocaleString('fr-FR'),
            log.userEmail || log.userId || 'N/A',
            log.action,
            log.entity,
            log.entityId || 'N/A',
            log.ipAddress || 'N/A',
        ]);

        const csv = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="audit-logs-${new Date().toISOString().split('T')[0]}.csv"`);
        res.send('\uFEFF' + csv);
    } catch (error) {
        next(error);
    }
});

// ============================================
// EXPORT COMPLET
// ============================================

/**
 * GET /api/v1/backoffice/export/:entity
 * Export CSV d'une entité
 */
router.get('/export/:entity', verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
    try {
        const { entity } = req.params;
        let data, headers, fileName;

        switch (entity) {
            case 'users':
                data = await prisma.user.findMany({
                    select: { id: true, email: true, role: true, createdAt: true },
                    orderBy: { createdAt: 'desc' },
                });
                headers = ['ID', 'Email', 'Rôle', 'Date création'];
                fileName = 'utilisateurs';
                break;

            case 'missions':
                data = await prisma.mission.findMany({
                    include: {
                        ecole: { select: { name: true } },
                        intervenant: { select: { firstName: true, lastName: true } },
                    },
                    orderBy: { createdAt: 'desc' },
                });
                headers = ['ID', 'Titre', 'École', 'Intervenant', 'Statut', 'Prix (€)', 'Date création'];
                fileName = 'missions';
                break;

            case 'intervenants':
                data = await prisma.intervenant.findMany({
                    include: { user: { select: { email: true } } },
                    orderBy: { createdAt: 'desc' },
                });
                headers = ['ID', 'Prénom', 'Nom', 'Email', 'SIRET', 'Statut', 'Date création'];
                fileName = 'intervenants';
                break;

            case 'ecoles':
                data = await prisma.ecole.findMany({
                    include: { user: { select: { email: true } } },
                    orderBy: { createdAt: 'desc' },
                });
                headers = ['ID', 'Nom', 'Email contact', 'Email compte', 'Téléphone', 'Date création'];
                fileName = 'ecoles';
                break;

            case 'factures':
                data = await prisma.facture.findMany({
                    orderBy: { createdAt: 'desc' },
                });
                headers = ['Numéro', 'Type', 'Montant HT', 'Montant TTC', 'Statut', 'Date émission'];
                fileName = 'factures';
                break;

            default:
                return res.status(400).json({ success: false, message: 'Entité non reconnue' });
        }

        // Formater les données en CSV
        let rows;
        switch (entity) {
            case 'users':
                rows = data.map(d => [d.id, d.email, d.role, new Date(d.createdAt).toLocaleDateString('fr-FR')]);
                break;
            case 'missions':
                rows = data.map(d => [
                    d.id, d.title, d.ecole?.name || 'N/A',
                    d.intervenant ? `${d.intervenant.firstName} ${d.intervenant.lastName}` : 'Non assigné',
                    d.status, d.priceCents ? (d.priceCents / 100).toFixed(2) : 'N/A',
                    new Date(d.createdAt).toLocaleDateString('fr-FR'),
                ]);
                break;
            case 'intervenants':
                rows = data.map(d => [
                    d.id, d.firstName || '', d.lastName || '', d.user?.email || '', d.siret || '',
                    d.status, new Date(d.createdAt).toLocaleDateString('fr-FR'),
                ]);
                break;
            case 'ecoles':
                rows = data.map(d => [
                    d.id, d.name, d.contactEmail || '', d.user?.email || '', d.phone || '',
                    new Date(d.createdAt).toLocaleDateString('fr-FR'),
                ]);
                break;
            case 'factures':
                rows = data.map(d => [
                    d.numero, d.type, (d.montantHT / 100).toFixed(2), (d.montantTTC / 100).toFixed(2),
                    d.status, d.dateEmission ? new Date(d.dateEmission).toLocaleDateString('fr-FR') : 'N/A',
                ]);
                break;
        }

        const csv = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}-${new Date().toISOString().split('T')[0]}.csv"`);
        res.send('\uFEFF' + csv);

        await logAudit(req, 'export', entity, null, null, { count: data.length });
    } catch (error) {
        next(error);
    }
});

export default router;
