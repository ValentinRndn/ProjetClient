/**
 * ============================================
 * Vizion Academy - Routes Contact
 * Formulaires de contact et partenariat
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
const createContactSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().max(20).optional().allow(''),
    company: Joi.string().max(100).optional().allow(''),
    type: Joi.string().valid('contact', 'partenariat', 'support', 'autre').default('contact'),
    subject: Joi.string().min(3).max(200).required(),
    message: Joi.string().min(10).max(5000).required(),
});

const querySchema = Joi.object({
    status: Joi.string().valid('new', 'read', 'replied', 'archived').optional(),
    type: Joi.string().valid('contact', 'partenariat', 'support', 'autre').optional(),
    take: Joi.number().integer().min(1).max(100).default(50),
    skip: Joi.number().integer().min(0).default(0),
});

const statusSchema = Joi.object({
    status: Joi.string().valid('new', 'read', 'replied', 'archived').required(),
});

const paramsSchema = Joi.object({
    id: Joi.string().uuid().required(),
});

// ============================================
// Route publique - Soumettre un message
// ============================================

/**
 * POST /api/v1/contact
 * Soumettre un message de contact (sans authentification)
 */
router.post('/', validate({ body: createContactSchema }), async (req, res, next) => {
    try {
        const { name, email, phone, company, type, subject, message } = req.body;

        logger.info('New contact message received', { name, email, type, subject });

        const contactMessage = await prisma.contactMessage.create({
            data: {
                name,
                email,
                phone: phone || null,
                company: company || null,
                type,
                subject,
                message,
                status: 'new',
            },
        });

        logger.info('Contact message saved', { id: contactMessage.id, type });

        res.status(201).json({
            success: true,
            message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
            data: {
                id: contactMessage.id,
                createdAt: contactMessage.createdAt,
            },
        });
    } catch (error) {
        logger.error('Error saving contact message', { error: error.message });
        next(error);
    }
});

// ============================================
// Routes Admin - Gestion des messages
// ============================================

/**
 * GET /api/v1/contact
 * Liste tous les messages de contact (Admin only)
 */
router.get('/', validate({ query: querySchema }), verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
    try {
        const { status, type, take, skip } = req.query;

        const where = {};
        if (status) where.status = status;
        if (type) where.type = type;

        const [messages, total] = await Promise.all([
            prisma.contactMessage.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: parseInt(take, 10),
                skip: parseInt(skip, 10),
            }),
            prisma.contactMessage.count({ where }),
        ]);

        res.json({
            success: true,
            data: messages,
            total,
            take: parseInt(take, 10),
            skip: parseInt(skip, 10),
        });
    } catch (error) {
        logger.error('Error fetching contact messages', { error: error.message });
        next(error);
    }
});

/**
 * GET /api/v1/contact/:id
 * Récupérer un message spécifique (Admin only)
 */
router.get('/:id', validate({ params: paramsSchema }), verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
    try {
        const { id } = req.params;

        const message = await prisma.contactMessage.findUnique({
            where: { id },
        });

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message non trouvé',
            });
        }

        // Marquer comme lu si nouveau
        if (message.status === 'new') {
            await prisma.contactMessage.update({
                where: { id },
                data: { status: 'read' },
            });
            message.status = 'read';
        }

        res.json({
            success: true,
            data: message,
        });
    } catch (error) {
        logger.error('Error fetching contact message', { id: req.params.id, error: error.message });
        next(error);
    }
});

/**
 * PATCH /api/v1/contact/:id/status
 * Mettre à jour le statut d'un message (Admin only)
 */
router.patch('/:id/status', validate({ params: paramsSchema, body: statusSchema }), verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const message = await prisma.contactMessage.update({
            where: { id },
            data: { status },
        });

        logger.info('Contact message status updated', { id, status });

        res.json({
            success: true,
            data: message,
        });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: 'Message non trouvé',
            });
        }
        logger.error('Error updating contact message status', { id: req.params.id, error: error.message });
        next(error);
    }
});

/**
 * DELETE /api/v1/contact/:id
 * Supprimer un message (Admin only)
 */
router.delete('/:id', validate({ params: paramsSchema }), verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
    try {
        const { id } = req.params;

        await prisma.contactMessage.delete({
            where: { id },
        });

        logger.info('Contact message deleted', { id });

        res.json({
            success: true,
            message: 'Message supprimé',
        });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: 'Message non trouvé',
            });
        }
        logger.error('Error deleting contact message', { id: req.params.id, error: error.message });
        next(error);
    }
});

/**
 * GET /api/v1/contact/stats
 * Statistiques des messages (Admin only)
 */
router.get('/stats/overview', verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
    try {
        const [total, newCount, byType] = await Promise.all([
            prisma.contactMessage.count(),
            prisma.contactMessage.count({ where: { status: 'new' } }),
            prisma.contactMessage.groupBy({
                by: ['type'],
                _count: { type: true },
            }),
        ]);

        res.json({
            success: true,
            data: {
                total,
                new: newCount,
                byType: byType.reduce((acc, item) => {
                    acc[item.type] = item._count.type;
                    return acc;
                }, {}),
            },
        });
    } catch (error) {
        logger.error('Error fetching contact stats', { error: error.message });
        next(error);
    }
});

export default router;
