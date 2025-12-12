/**
 * ============================================
 * Vizion Academy - Service Email
 * Gestion des envois d'emails et templates
 * ============================================
 */

import nodemailer from 'nodemailer';
import prisma from '../../prisma.js';
import logger from '../utils/logger.js';

// Configuration du transporteur
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
    },
});

// Email d'expédition par défaut
const DEFAULT_FROM = process.env.EMAIL_FROM || 'Vizion Academy <noreply@vizion-academy.fr>';

/**
 * Remplace les variables dans un template
 */
function replaceVariables(template, variables) {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        result = result.replace(regex, value || '');
    }
    return result;
}

/**
 * Envoie un email simple
 */
export async function sendEmail(to, subject, html, text = null) {
    try {
        // Créer le log avant envoi
        const emailLog = await prisma.emailLog.create({
            data: {
                to,
                subject,
                status: 'pending',
            },
        });

        // Envoyer l'email
        const info = await transporter.sendMail({
            from: DEFAULT_FROM,
            to,
            subject,
            html,
            text: text || html.replace(/<[^>]*>/g, ''), // Fallback texte
        });

        // Mettre à jour le log
        await prisma.emailLog.update({
            where: { id: emailLog.id },
            data: {
                status: 'sent',
                sentAt: new Date(),
            },
        });

        logger.info('Email sent successfully', { to, subject, messageId: info.messageId });
        return { success: true, messageId: info.messageId };
    } catch (error) {
        // Logger l'erreur
        logger.error('Failed to send email', { to, subject, error: error.message });

        // Mettre à jour le log avec l'erreur
        try {
            await prisma.emailLog.updateMany({
                where: { to, subject, status: 'pending' },
                data: {
                    status: 'failed',
                    error: error.message,
                },
            });
        } catch (dbError) {
            logger.error('Failed to update email log', { error: dbError.message });
        }

        return { success: false, error: error.message };
    }
}

/**
 * Envoie un email avec template
 */
export async function sendTemplateEmail(to, templateCode, variables = {}) {
    try {
        // Récupérer le template
        const template = await prisma.emailTemplate.findUnique({
            where: { code: templateCode },
        });

        if (!template || !template.isActive) {
            logger.warn('Email template not found or inactive', { templateCode });
            return { success: false, error: 'Template not found' };
        }

        // Remplacer les variables
        const subject = replaceVariables(template.subject, variables);
        const html = replaceVariables(template.htmlContent, variables);
        const text = template.textContent ? replaceVariables(template.textContent, variables) : null;

        // Créer le log
        const emailLog = await prisma.emailLog.create({
            data: {
                to,
                subject,
                templateCode,
                status: 'pending',
            },
        });

        // Envoyer l'email
        const info = await transporter.sendMail({
            from: DEFAULT_FROM,
            to,
            subject,
            html,
            text: text || html.replace(/<[^>]*>/g, ''),
        });

        // Mettre à jour le log
        await prisma.emailLog.update({
            where: { id: emailLog.id },
            data: {
                status: 'sent',
                sentAt: new Date(),
            },
        });

        logger.info('Template email sent', { to, templateCode, messageId: info.messageId });
        return { success: true, messageId: info.messageId };
    } catch (error) {
        logger.error('Failed to send template email', { to, templateCode, error: error.message });
        return { success: false, error: error.message };
    }
}

/**
 * Crée une notification et envoie optionnellement un email
 */
export async function createNotification(userId, type, title, message, data = null, sendEmailToo = true) {
    try {
        // Créer la notification
        const notification = await prisma.notification.create({
            data: {
                userId,
                type,
                title,
                message,
                data,
            },
        });

        // Envoyer l'email si demandé
        if (sendEmailToo) {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { email: true },
            });

            if (user?.email) {
                const result = await sendEmail(user.email, title, `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 30px; text-align: center;">
                            <h1 style="color: white; margin: 0;">Vizion Academy</h1>
                        </div>
                        <div style="padding: 30px; background: #ffffff;">
                            <h2 style="color: #1F2937; margin-top: 0;">${title}</h2>
                            <p style="color: #4B5563; line-height: 1.6;">${message}</p>
                        </div>
                        <div style="padding: 20px; background: #F3F4F6; text-align: center;">
                            <p style="color: #6B7280; font-size: 12px; margin: 0;">
                                Vizion Academy - Plateforme de mise en relation écoles-intervenants
                            </p>
                        </div>
                    </div>
                `);

                if (result.success) {
                    await prisma.notification.update({
                        where: { id: notification.id },
                        data: {
                            emailSent: true,
                            emailSentAt: new Date(),
                        },
                    });
                }
            }
        }

        logger.info('Notification created', { notificationId: notification.id, userId, type });
        return notification;
    } catch (error) {
        logger.error('Failed to create notification', { userId, type, error: error.message });
        throw error;
    }
}

/**
 * Types de notifications prédéfinis
 */
export const NotificationTypes = {
    // Missions
    MISSION_CREATED: 'mission_created',
    MISSION_ASSIGNED: 'mission_assigned',
    MISSION_COMPLETED: 'mission_completed',
    MISSION_CANCELLED: 'mission_cancelled',

    // Candidatures
    APPLICATION_RECEIVED: 'application_received',
    APPLICATION_ACCEPTED: 'application_accepted',
    APPLICATION_REJECTED: 'application_rejected',

    // Factures
    FACTURE_CREATED: 'facture_created',
    FACTURE_SENT: 'facture_sent',
    FACTURE_PAID: 'facture_paid',
    FACTURE_OVERDUE: 'facture_overdue',

    // Documents
    DOCUMENT_UPLOADED: 'document_uploaded',
    DOCUMENT_VALIDATED: 'document_validated',
    DOCUMENT_REJECTED: 'document_rejected',

    // Compte
    WELCOME: 'welcome',
    PASSWORD_RESET: 'password_reset',
    PROFILE_VALIDATED: 'profile_validated',
    PROFILE_REJECTED: 'profile_rejected',

    // Admin
    NEW_REGISTRATION: 'new_registration',
    CONTACT_MESSAGE: 'contact_message',
};

/**
 * Envoie une notification de bienvenue
 */
export async function sendWelcomeNotification(userId, userName) {
    return createNotification(
        userId,
        NotificationTypes.WELCOME,
        'Bienvenue sur Vizion Academy !',
        `Bonjour ${userName}, bienvenue sur Vizion Academy ! Votre compte a été créé avec succès. Vous pouvez maintenant compléter votre profil et commencer à utiliser la plateforme.`,
        { userName }
    );
}

/**
 * Notifie une école d'une nouvelle candidature
 */
export async function notifyNewApplication(missionId, intervenantName) {
    try {
        const mission = await prisma.mission.findUnique({
            where: { id: missionId },
            include: {
                ecole: { include: { user: true } },
            },
        });

        if (mission?.ecole?.user) {
            return createNotification(
                mission.ecole.user.id,
                NotificationTypes.APPLICATION_RECEIVED,
                'Nouvelle candidature reçue',
                `${intervenantName} a postulé pour votre mission "${mission.title}". Consultez son profil et sa candidature dès maintenant.`,
                { missionId, intervenantName }
            );
        }
    } catch (error) {
        logger.error('Failed to send application notification', { missionId, error: error.message });
    }
}

/**
 * Notifie un intervenant que sa candidature a été acceptée
 */
export async function notifyApplicationAccepted(intervenantUserId, missionTitle, ecoleName) {
    return createNotification(
        intervenantUserId,
        NotificationTypes.APPLICATION_ACCEPTED,
        'Candidature acceptée !',
        `Félicitations ! Votre candidature pour la mission "${missionTitle}" a été acceptée par ${ecoleName}. Vous pouvez maintenant commencer à travailler sur cette mission.`,
        { missionTitle, ecoleName }
    );
}

/**
 * Notifie la création d'une facture
 */
export async function notifyFactureCreated(userId, factureNumero, montant) {
    return createNotification(
        userId,
        NotificationTypes.FACTURE_CREATED,
        'Nouvelle facture créée',
        `Une nouvelle facture ${factureNumero} d'un montant de ${montant} a été créée pour vous.`,
        { factureNumero, montant }
    );
}

/**
 * Récupère les notifications non lues d'un utilisateur
 */
export async function getUnreadNotifications(userId) {
    return prisma.notification.findMany({
        where: {
            userId,
            read: false,
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
    });
}

/**
 * Marque une notification comme lue
 */
export async function markAsRead(notificationId, userId) {
    return prisma.notification.updateMany({
        where: {
            id: notificationId,
            userId,
        },
        data: {
            read: true,
            readAt: new Date(),
        },
    });
}

/**
 * Marque toutes les notifications comme lues
 */
export async function markAllAsRead(userId) {
    return prisma.notification.updateMany({
        where: {
            userId,
            read: false,
        },
        data: {
            read: true,
            readAt: new Date(),
        },
    });
}

export default {
    sendEmail,
    sendTemplateEmail,
    createNotification,
    sendWelcomeNotification,
    notifyNewApplication,
    notifyApplicationAccepted,
    notifyFactureCreated,
    getUnreadNotifications,
    markAsRead,
    markAllAsRead,
    NotificationTypes,
};
