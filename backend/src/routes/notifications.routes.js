/**
 * ============================================
 * Vizion Academy - Routes Notifications
 * API pour la gestion des notifications
 * ============================================
 */

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken, checkRole } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import Joi from 'joi';
import logger from '../utils/logger.js';
import { markAsRead, markAllAsRead, createNotification, NotificationTypes } from '../services/email.service.js';

const router = Router();
const prisma = new PrismaClient();

// Schemas de validation
const querySchema = Joi.object({
    read: Joi.boolean().optional(),
    type: Joi.string().optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(20),
});

const paramsSchema = Joi.object({
    id: Joi.string().uuid().required(),
});

const createNotificationSchema = Joi.object({
    userId: Joi.string().uuid().required(),
    type: Joi.string().required(),
    title: Joi.string().max(200).required(),
    message: Joi.string().max(1000).required(),
    data: Joi.object().optional(),
    sendEmail: Joi.boolean().default(true),
});

/**
 * GET /api/v1/notifications
 * Liste des notifications de l'utilisateur connecté
 */
router.get('/', verifyToken, validate({ query: querySchema }), async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { read, type, page, limit } = req.query;

        const where = { userId };
        if (read !== undefined) where.read = read;
        if (type) where.type = type;

        const total = await prisma.notification.count({ where });
        const notifications = await prisma.notification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        });

        // Compter les non lues
        const unreadCount = await prisma.notification.count({
            where: { userId, read: false },
        });

        res.json({
            success: true,
            data: notifications,
            unreadCount,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        logger.error('Error fetching notifications', { error: error.message });
        next(error);
    }
});

/**
 * GET /api/v1/notifications/unread-count
 * Nombre de notifications non lues
 */
router.get('/unread-count', verifyToken, async (req, res, next) => {
    try {
        const count = await prisma.notification.count({
            where: { userId: req.user.id, read: false },
        });

        res.json({ success: true, count });
    } catch (error) {
        logger.error('Error counting unread notifications', { error: error.message });
        next(error);
    }
});

/**
 * POST /api/v1/notifications/:id/read
 * Marquer une notification comme lue
 */
router.post('/:id/read', validate({ params: paramsSchema }), verifyToken, async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        await markAsRead(id, userId);

        res.json({ success: true, message: 'Notification marquée comme lue' });
    } catch (error) {
        logger.error('Error marking notification as read', { error: error.message });
        next(error);
    }
});

/**
 * POST /api/v1/notifications/read-all
 * Marquer toutes les notifications comme lues
 */
router.post('/read-all', verifyToken, async (req, res, next) => {
    try {
        await markAllAsRead(req.user.id);

        res.json({ success: true, message: 'Toutes les notifications marquées comme lues' });
    } catch (error) {
        logger.error('Error marking all notifications as read', { error: error.message });
        next(error);
    }
});

/**
 * DELETE /api/v1/notifications/:id
 * Supprimer une notification
 */
router.delete('/:id', validate({ params: paramsSchema }), verifyToken, async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        await prisma.notification.deleteMany({
            where: { id, userId },
        });

        res.json({ success: true, message: 'Notification supprimée' });
    } catch (error) {
        logger.error('Error deleting notification', { error: error.message });
        next(error);
    }
});

/**
 * POST /api/v1/notifications (Admin)
 * Créer et envoyer une notification
 */
router.post('/', validate({ body: createNotificationSchema }), verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
    try {
        const { userId, type, title, message, data, sendEmail } = req.body;

        const notification = await createNotification(userId, type, title, message, data, sendEmail);

        logger.info('Notification created by admin', { notificationId: notification.id, adminId: req.user.id });

        res.status(201).json({
            success: true,
            message: 'Notification créée',
            data: notification,
        });
    } catch (error) {
        logger.error('Error creating notification', { error: error.message });
        next(error);
    }
});

/**
 * GET /api/v1/notifications/types
 * Liste des types de notifications disponibles
 */
router.get('/types', verifyToken, checkRole(['ADMIN']), async (req, res) => {
    res.json({
        success: true,
        data: Object.entries(NotificationTypes).map(([key, value]) => ({
            key,
            value,
        })),
    });
});

/**
 * GET /api/v1/notifications/admin/logs
 * Historique des emails envoyés (admin)
 */
router.get('/admin/logs', verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        const where = {};
        if (status) where.status = status;

        const total = await prisma.emailLog.count({ where });
        const logs = await prisma.emailLog.findMany({
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
        logger.error('Error fetching email logs', { error: error.message });
        next(error);
    }
});

/**
 * GET /api/v1/notifications/admin/templates
 * Liste des templates d'email (admin)
 */
router.get('/admin/templates', verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
    try {
        const templates = await prisma.emailTemplate.findMany({
            orderBy: { name: 'asc' },
        });

        res.json({ success: true, data: templates });
    } catch (error) {
        logger.error('Error fetching templates', { error: error.message });
        next(error);
    }
});

/**
 * POST /api/v1/notifications/admin/templates
 * Créer un template d'email (admin)
 */
router.post('/admin/templates', verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
    try {
        const { code, name, subject, htmlContent, textContent, variables } = req.body;

        const template = await prisma.emailTemplate.create({
            data: { code, name, subject, htmlContent, textContent, variables },
        });

        logger.info('Email template created', { templateId: template.id, code });

        res.status(201).json({
            success: true,
            message: 'Template créé',
            data: template,
        });
    } catch (error) {
        logger.error('Error creating template', { error: error.message });
        next(error);
    }
});

/**
 * PATCH /api/v1/notifications/admin/templates/:id
 * Modifier un template d'email (admin)
 */
router.patch('/admin/templates/:id', validate({ params: paramsSchema }), verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, subject, htmlContent, textContent, variables, isActive } = req.body;

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (subject !== undefined) updateData.subject = subject;
        if (htmlContent !== undefined) updateData.htmlContent = htmlContent;
        if (textContent !== undefined) updateData.textContent = textContent;
        if (variables !== undefined) updateData.variables = variables;
        if (isActive !== undefined) updateData.isActive = isActive;

        const template = await prisma.emailTemplate.update({
            where: { id },
            data: updateData,
        });

        logger.info('Email template updated', { templateId: id });

        res.json({
            success: true,
            message: 'Template mis à jour',
            data: template,
        });
    } catch (error) {
        logger.error('Error updating template', { error: error.message });
        next(error);
    }
});

export default router;
