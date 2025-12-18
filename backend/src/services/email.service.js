/**
 * ============================================
 * Vizion Academy - Service Email
 * Gestion des envois d'emails et templates
 * Design aligné sur la charte graphique
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

// URL de base du frontend
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Couleurs de la charte graphique Vizion Academy
const COLORS = {
    primary: '#1c2942',      // Bleu foncé principal
    secondary: '#6d74b5',    // Violet/bleu
    accent: '#dbbacf',       // Rose pâle
    light: '#ebf2fa',        // Bleu très clair
    white: '#ffffff',
    gray: '#6B7280',
    success: '#10B981',
    error: '#EF4444',
};

/**
 * Génère le template HTML de base pour tous les emails
 */
function generateEmailTemplate({ title, preheader, content, ctaText, ctaUrl, footerText }) {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${title}</title>
    ${preheader ? `<span style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</span>` : ''}
    <!--[if mso]>
    <style type="text/css">
        body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
    </style>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: ${COLORS.light};">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: ${COLORS.light};">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%;">

                    <!-- Header avec logo -->
                    <tr>
                        <td style="background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%); padding: 40px 30px; border-radius: 16px 16px 0 0; text-align: center;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td align="center">
                                        <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: ${COLORS.white}; letter-spacing: -0.5px;">
                                            VIZION ACADEMY
                                        </h1>
                                        <p style="margin: 8px 0 0 0; font-size: 14px; color: ${COLORS.accent}; font-weight: 500;">
                                            Plateforme de mise en relation écoles-intervenants
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Contenu principal -->
                    <tr>
                        <td style="background-color: ${COLORS.white}; padding: 40px 30px;">
                            ${content}

                            ${ctaText && ctaUrl ? `
                            <!-- Bouton CTA -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 30px;">
                                <tr>
                                    <td align="center">
                                        <a href="${ctaUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, ${COLORS.secondary} 0%, ${COLORS.primary} 100%); color: ${COLORS.white}; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(109, 116, 181, 0.4);">
                                            ${ctaText}
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            ` : ''}
                        </td>
                    </tr>

                    <!-- Séparateur décoratif -->
                    <tr>
                        <td style="background-color: ${COLORS.white}; padding: 0 30px;">
                            <div style="height: 4px; background: linear-gradient(90deg, ${COLORS.accent} 0%, ${COLORS.secondary} 50%, ${COLORS.primary} 100%); border-radius: 2px;"></div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: ${COLORS.white}; padding: 30px; border-radius: 0 0 16px 16px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                ${footerText ? `
                                <tr>
                                    <td style="padding-bottom: 20px; text-align: center;">
                                        <p style="margin: 0; font-size: 14px; color: ${COLORS.gray}; line-height: 1.6;">
                                            ${footerText}
                                        </p>
                                    </td>
                                </tr>
                                ` : ''}
                                <tr>
                                    <td align="center" style="padding-top: 20px; border-top: 1px solid ${COLORS.light};">
                                        <p style="margin: 0 0 10px 0; font-size: 12px; color: ${COLORS.gray};">
                                            © ${new Date().getFullYear()} Vizion Academy. Tous droits réservés.
                                        </p>
                                        <p style="margin: 0; font-size: 12px; color: ${COLORS.gray};">
                                            <a href="${FRONTEND_URL}" style="color: ${COLORS.secondary}; text-decoration: none;">Visiter le site</a>
                                            &nbsp;•&nbsp;
                                            <a href="${FRONTEND_URL}/contact" style="color: ${COLORS.secondary}; text-decoration: none;">Nous contacter</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
}

/**
 * Génère une box d'information stylisée
 */
function generateInfoBox(items) {
    const itemsHtml = items.map(item => `
        <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid ${COLORS.light};">
                <span style="color: ${COLORS.gray}; font-size: 13px;">${item.label}</span>
            </td>
            <td style="padding: 8px 0; border-bottom: 1px solid ${COLORS.light}; text-align: right;">
                <span style="color: ${COLORS.primary}; font-weight: 600; font-size: 14px;">${item.value}</span>
            </td>
        </tr>
    `).join('');

    return `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: ${COLORS.light}; border-radius: 12px; margin-top: 20px;">
            <tr>
                <td style="padding: 20px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                        ${itemsHtml}
                    </table>
                </td>
            </tr>
        </table>
    `;
}

/**
 * Génère un badge de statut
 */
function generateStatusBadge(text, type = 'info') {
    const colors = {
        success: { bg: '#D1FAE5', text: '#065F46' },
        error: { bg: '#FEE2E2', text: '#991B1B' },
        warning: { bg: '#FEF3C7', text: '#92400E' },
        info: { bg: COLORS.light, text: COLORS.secondary },
    };
    const color = colors[type] || colors.info;

    return `<span style="display: inline-block; background-color: ${color.bg}; color: ${color.text}; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">${text}</span>`;
}

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
 * Détermine le CTA approprié selon le type de notification
 */
function getCtaForNotificationType(type, data = {}) {
    const ctaConfig = {
        // Missions
        [NotificationTypes.MISSION_CREATED]: {
            text: 'Voir la mission',
            url: data.missionId ? `${FRONTEND_URL}/missions/${data.missionId}` : `${FRONTEND_URL}/missions`
        },
        [NotificationTypes.MISSION_ASSIGNED]: {
            text: 'Voir mes missions',
            url: `${FRONTEND_URL}/dashboard`
        },
        [NotificationTypes.MISSION_COMPLETED]: {
            text: 'Voir le récapitulatif',
            url: `${FRONTEND_URL}/dashboard`
        },

        // Candidatures
        [NotificationTypes.APPLICATION_RECEIVED]: {
            text: 'Voir les candidatures',
            url: data.missionId ? `${FRONTEND_URL}/missions/${data.missionId}/candidatures` : `${FRONTEND_URL}/dashboard`
        },
        [NotificationTypes.APPLICATION_ACCEPTED]: {
            text: 'Voir la mission',
            url: `${FRONTEND_URL}/dashboard`
        },
        [NotificationTypes.APPLICATION_REJECTED]: {
            text: 'Découvrir d\'autres missions',
            url: `${FRONTEND_URL}/missions`
        },

        // Documents
        [NotificationTypes.DOCUMENT_UPLOADED]: {
            text: 'Voir mes documents',
            url: `${FRONTEND_URL}/dashboard/documents`
        },
        [NotificationTypes.DOCUMENT_VALIDATED]: {
            text: 'Voir mes documents',
            url: `${FRONTEND_URL}/dashboard/documents`
        },

        // Compte
        [NotificationTypes.WELCOME]: {
            text: 'Compléter mon profil',
            url: `${FRONTEND_URL}/dashboard/profile`
        },
        [NotificationTypes.PROFILE_VALIDATED]: {
            text: 'Voir les missions disponibles',
            url: `${FRONTEND_URL}/missions`
        },
        [NotificationTypes.PROFILE_REJECTED]: {
            text: 'Nous contacter',
            url: `${FRONTEND_URL}/contact`
        },

        // Factures
        [NotificationTypes.FACTURE_CREATED]: {
            text: 'Voir mes factures',
            url: `${FRONTEND_URL}/dashboard/factures`
        },
    };

    return ctaConfig[type] || { text: 'Accéder à mon espace', url: `${FRONTEND_URL}/dashboard` };
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
                select: { email: true, role: true },
            });

            if (user?.email) {
                // Déterminer le CTA selon le type de notification
                const cta = getCtaForNotificationType(type, data);

                // Générer le contenu HTML avec le nouveau template
                const content = `
                    <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: ${COLORS.primary};">
                        ${title}
                    </h2>
                    <p style="margin: 0; font-size: 16px; color: ${COLORS.gray}; line-height: 1.7;">
                        ${message}
                    </p>
                `;

                const html = generateEmailTemplate({
                    title,
                    preheader: message.substring(0, 100),
                    content,
                    ctaText: cta.text,
                    ctaUrl: cta.url,
                    footerText: 'Cet email a été envoyé automatiquement suite à une action sur votre compte Vizion Academy.'
                });

                const result = await sendEmail(user.email, title, html);

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
    // Créer la notification en base
    const notification = await prisma.notification.create({
        data: {
            userId,
            type: NotificationTypes.WELCOME,
            title: 'Bienvenue sur Vizion Academy !',
            message: `Bienvenue ${userName} ! Votre compte a été créé avec succès.`,
            data: { userName },
        },
    });

    // Récupérer l'email et le rôle de l'utilisateur
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, role: true },
    });

    if (user?.email) {
        const subject = '👋 Bienvenue sur Vizion Academy !';
        const isIntervenant = user.role === 'INTERVENANT';
        const isEcole = user.role === 'ECOLE';

        const content = `
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, ${COLORS.secondary} 0%, ${COLORS.primary} 100%); border-radius: 50%; line-height: 80px; margin-bottom: 15px;">
                    <span style="font-size: 40px;">👋</span>
                </div>
            </div>

            <h2 style="margin: 0 0 20px 0; font-size: 26px; font-weight: 700; color: ${COLORS.primary}; text-align: center;">
                Bienvenue ${userName} !
            </h2>

            <p style="margin: 0 0 20px 0; font-size: 16px; color: ${COLORS.gray}; line-height: 1.7; text-align: center;">
                Votre compte a été créé avec succès sur Vizion Academy, la plateforme de mise en relation entre écoles et intervenants professionnels.
            </p>

            ${isIntervenant ? `
            <div style="background: linear-gradient(135deg, ${COLORS.accent}20 0%, ${COLORS.light} 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border: 1px solid ${COLORS.accent}40;">
                <h3 style="margin: 0 0 15px 0; font-size: 18px; color: ${COLORS.primary};">📋 Prochaines étapes pour les intervenants :</h3>
                <ul style="margin: 0; padding: 0 0 0 20px; color: ${COLORS.gray}; line-height: 2;">
                    <li><strong>Complétez votre profil</strong> - Ajoutez vos compétences et expériences</li>
                    <li><strong>Uploadez vos documents</strong> - CV, diplômes, certifications</li>
                    <li><strong>Attendez la validation</strong> - Notre équipe vérifiera votre profil</li>
                    <li><strong>Postulez aux missions</strong> - Une fois validé, accédez aux offres</li>
                </ul>
            </div>

            <p style="margin: 0 0 20px 0; font-size: 14px; color: ${COLORS.gray}; line-height: 1.6; padding: 15px; background-color: ${COLORS.light}; border-radius: 8px; border-left: 4px solid ${COLORS.secondary};">
                <strong>💡 Astuce :</strong> Un profil complet augmente considérablement vos chances d'être sélectionné par les écoles !
            </p>
            ` : ''}

            ${isEcole ? `
            <div style="background: linear-gradient(135deg, ${COLORS.accent}20 0%, ${COLORS.light} 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border: 1px solid ${COLORS.accent}40;">
                <h3 style="margin: 0 0 15px 0; font-size: 18px; color: ${COLORS.primary};">🏫 Ce que vous pouvez faire :</h3>
                <ul style="margin: 0; padding: 0 0 0 20px; color: ${COLORS.gray}; line-height: 2;">
                    <li><strong>Publiez des missions</strong> - Décrivez vos besoins en intervention</li>
                    <li><strong>Parcourez les profils</strong> - Découvrez nos intervenants qualifiés</li>
                    <li><strong>Gérez vos candidatures</strong> - Acceptez ou refusez les propositions</li>
                    <li><strong>Suivez vos missions</strong> - Tableau de bord complet</li>
                </ul>
            </div>
            ` : ''}

            <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: ${COLORS.light}; border-radius: 12px;">
                <p style="margin: 0; font-size: 16px; color: ${COLORS.primary}; font-weight: 500;">
                    Une question ? Notre équipe est là pour vous aider !
                </p>
            </div>
        `;

        const html = generateEmailTemplate({
            title: subject,
            preheader: `${userName}, bienvenue sur Vizion Academy ! Votre compte est prêt.`,
            content,
            ctaText: isIntervenant ? 'Compléter mon profil' : 'Accéder à mon espace',
            ctaUrl: `${FRONTEND_URL}/dashboard`,
            footerText: 'Merci de nous avoir rejoint ! L\'équipe Vizion Academy'
        });

        const result = await sendEmail(user.email, subject, html);

        if (result.success) {
            await prisma.notification.update({
                where: { id: notification.id },
                data: { emailSent: true, emailSentAt: new Date() },
            });
        }
    }

    return notification;
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
    // Créer la notification en base
    const notification = await prisma.notification.create({
        data: {
            userId: intervenantUserId,
            type: NotificationTypes.APPLICATION_ACCEPTED,
            title: 'Candidature acceptée !',
            message: `Félicitations ! Votre candidature pour "${missionTitle}" a été acceptée.`,
            data: { missionTitle, ecoleName },
        },
    });

    // Récupérer l'email et prénom de l'utilisateur
    const user = await prisma.user.findUnique({
        where: { id: intervenantUserId },
        select: {
            email: true,
            intervenant: { select: { firstName: true } }
        },
    });

    if (user?.email) {
        const firstName = user.intervenant?.firstName || 'Intervenant';
        const subject = '🎉 Félicitations ! Votre candidature a été acceptée';

        const content = `
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, ${COLORS.success} 0%, #059669 100%); border-radius: 50%; line-height: 80px; margin-bottom: 15px;">
                    <span style="font-size: 40px;">🎉</span>
                </div>
            </div>

            <h2 style="margin: 0 0 20px 0; font-size: 26px; font-weight: 700; color: ${COLORS.primary}; text-align: center;">
                Félicitations ${firstName} !
            </h2>

            <p style="margin: 0 0 20px 0; font-size: 18px; color: ${COLORS.gray}; line-height: 1.7; text-align: center;">
                Votre candidature a été <strong style="color: ${COLORS.success};">acceptée</strong> !
            </p>

            <div style="background: linear-gradient(135deg, #D1FAE520 0%, ${COLORS.light} 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border: 2px solid ${COLORS.success}30;">
                <h3 style="margin: 0 0 10px 0; font-size: 20px; color: ${COLORS.primary};">
                    ${missionTitle}
                </h3>
                <p style="margin: 0; font-size: 14px; color: ${COLORS.secondary};">
                    Mission confiée par <strong>${ecoleName}</strong>
                </p>
            </div>

            <div style="background-color: ${COLORS.light}; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <h4 style="margin: 0 0 15px 0; font-size: 16px; color: ${COLORS.primary};">Prochaines étapes :</h4>
                <ul style="margin: 0; padding: 0 0 0 20px; color: ${COLORS.gray}; line-height: 2;">
                    <li>Consultez les détails de la mission dans votre tableau de bord</li>
                    <li>Préparez-vous pour le début de la mission</li>
                    <li>N'hésitez pas à contacter l'école si vous avez des questions</li>
                </ul>
            </div>

            <p style="margin: 25px 0 0 0; font-size: 14px; color: ${COLORS.secondary}; text-align: center; font-style: italic;">
                Merci pour votre confiance et bonne mission !
            </p>
        `;

        const html = generateEmailTemplate({
            title: subject,
            preheader: `${firstName}, votre candidature pour "${missionTitle}" a été acceptée !`,
            content,
            ctaText: 'Voir ma mission',
            ctaUrl: `${FRONTEND_URL}/dashboard`,
            footerText: 'Nous vous souhaitons une excellente collaboration !'
        });

        const result = await sendEmail(user.email, subject, html);

        if (result.success) {
            await prisma.notification.update({
                where: { id: notification.id },
                data: { emailSent: true, emailSentAt: new Date() },
            });
        }
    }

    return notification;
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
 * Notifie les admins d'une nouvelle inscription intervenant
 * Envoie directement à l'email configuré dans .env (SMTP_USER)
 */
export async function notifyAdminNewIntervenantRegistration(intervenantData) {
    try {
        // Utiliser l'email configuré dans .env au lieu des admins en base
        const adminEmail = process.env.SMTP_USER;

        if (!adminEmail) {
            logger.warn('No SMTP_USER configured, skipping admin notification');
            return;
        }

        const intervenantName = [intervenantData.firstName, intervenantData.lastName]
            .filter(Boolean)
            .join(' ') || 'Nouvel intervenant';

        const subject = '🆕 Nouvelle demande d\'inscription intervenant';

        // Contenu avec info box stylisée
        const content = `
            <div style="text-align: center; margin-bottom: 30px;">
                ${generateStatusBadge('Nouvelle inscription', 'warning')}
            </div>

            <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: ${COLORS.primary};">
                Nouvelle demande d'inscription
            </h2>

            <p style="margin: 0 0 20px 0; font-size: 16px; color: ${COLORS.gray}; line-height: 1.7;">
                Un nouvel intervenant vient de s'inscrire sur la plateforme et attend votre validation pour accéder aux missions.
            </p>

            ${generateInfoBox([
                { label: 'Nom complet', value: intervenantName },
                { label: 'Email', value: intervenantData.email },
                { label: 'Date d\'inscription', value: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }
            ])}

            <p style="margin: 25px 0 0 0; font-size: 14px; color: ${COLORS.gray}; line-height: 1.6; padding: 15px; background-color: ${COLORS.light}; border-radius: 8px; border-left: 4px solid ${COLORS.accent};">
                <strong>Action requise :</strong> Veuillez examiner le profil de cet intervenant et approuver ou rejeter sa demande d'inscription.
            </p>
        `;

        const html = generateEmailTemplate({
            title: subject,
            preheader: `${intervenantName} vient de s'inscrire comme intervenant`,
            content,
            ctaText: 'Gérer les inscriptions',
            ctaUrl: `${FRONTEND_URL}/dashboard/admin/intervenants`,
            footerText: 'Vous recevez cet email car vous êtes administrateur de Vizion Academy.'
        });

        await sendEmail(adminEmail, subject, html);

        logger.info('Admin notification sent for new intervenant registration', {
            email: intervenantData.email,
            sentTo: adminEmail
        });
    } catch (error) {
        logger.error('Failed to notify admins of new registration', { error: error.message });
    }
}

/**
 * Notifie un intervenant que son inscription a été validée
 */
export async function notifyIntervenantApproved(intervenantUserId, intervenantName) {
    // Créer la notification en base
    const notification = await prisma.notification.create({
        data: {
            userId: intervenantUserId,
            type: NotificationTypes.PROFILE_VALIDATED,
            title: 'Votre profil a été validé !',
            message: `Félicitations ${intervenantName} ! Votre inscription a été approuvée.`,
            data: { status: 'approved' },
        },
    });

    // Récupérer l'email de l'utilisateur
    const user = await prisma.user.findUnique({
        where: { id: intervenantUserId },
        select: { email: true },
    });

    if (user?.email) {
        const subject = '🎉 Félicitations ! Votre profil a été validé';

        const content = `
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, ${COLORS.success} 0%, #059669 100%); border-radius: 50%; line-height: 80px; margin-bottom: 15px;">
                    <span style="font-size: 40px;">✓</span>
                </div>
            </div>

            <h2 style="margin: 0 0 20px 0; font-size: 26px; font-weight: 700; color: ${COLORS.primary}; text-align: center;">
                Bienvenue dans notre réseau, ${intervenantName} !
            </h2>

            <p style="margin: 0 0 20px 0; font-size: 16px; color: ${COLORS.gray}; line-height: 1.7; text-align: center;">
                Excellente nouvelle ! Votre demande d'inscription a été <strong style="color: ${COLORS.success};">approuvée</strong> par notre équipe.
            </p>

            <div style="background: linear-gradient(135deg, ${COLORS.light} 0%, #ffffff 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border: 1px solid ${COLORS.light};">
                <h3 style="margin: 0 0 15px 0; font-size: 18px; color: ${COLORS.primary};">Vous pouvez maintenant :</h3>
                <ul style="margin: 0; padding: 0 0 0 20px; color: ${COLORS.gray}; line-height: 2;">
                    <li>Consulter et postuler aux missions disponibles</li>
                    <li>Être contacté directement par les écoles</li>
                    <li>Gérer votre profil et vos disponibilités</li>
                    <li>Suivre vos candidatures en temps réel</li>
                </ul>
            </div>

            <p style="margin: 0; font-size: 14px; color: ${COLORS.secondary}; text-align: center; font-style: italic;">
                N'hésitez pas à compléter votre profil pour augmenter vos chances d'être sélectionné !
            </p>
        `;

        const html = generateEmailTemplate({
            title: subject,
            preheader: `${intervenantName}, votre profil intervenant a été validé !`,
            content,
            ctaText: 'Découvrir les missions',
            ctaUrl: `${FRONTEND_URL}/missions`,
            footerText: 'Merci de faire partie de la communauté Vizion Academy !'
        });

        const result = await sendEmail(user.email, subject, html);

        if (result.success) {
            await prisma.notification.update({
                where: { id: notification.id },
                data: { emailSent: true, emailSentAt: new Date() },
            });
        }
    }

    return notification;
}

/**
 * Notifie un intervenant que son inscription a été rejetée
 */
export async function notifyIntervenantRejected(intervenantUserId, intervenantName, reason = null) {
    const message = reason
        ? `Votre demande n'a pas été approuvée. Raison : ${reason}`
        : `Votre demande n'a pas été approuvée.`;

    // Créer la notification en base
    const notification = await prisma.notification.create({
        data: {
            userId: intervenantUserId,
            type: NotificationTypes.PROFILE_REJECTED,
            title: 'Votre demande n\'a pas été approuvée',
            message,
            data: { status: 'rejected', reason },
        },
    });

    // Récupérer l'email de l'utilisateur
    const user = await prisma.user.findUnique({
        where: { id: intervenantUserId },
        select: { email: true },
    });

    if (user?.email) {
        const subject = 'Information concernant votre inscription';

        const content = `
            <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: ${COLORS.primary};">
                Bonjour ${intervenantName},
            </h2>

            <p style="margin: 0 0 20px 0; font-size: 16px; color: ${COLORS.gray}; line-height: 1.7;">
                Nous avons bien examiné votre demande d'inscription sur Vizion Academy.
            </p>

            <p style="margin: 0 0 20px 0; font-size: 16px; color: ${COLORS.gray}; line-height: 1.7;">
                Malheureusement, nous ne sommes pas en mesure d'accepter votre candidature pour le moment.
            </p>

            ${reason ? `
            <div style="background-color: ${COLORS.light}; border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid ${COLORS.secondary};">
                <p style="margin: 0; font-size: 14px; color: ${COLORS.gray};">
                    <strong style="color: ${COLORS.primary};">Raison :</strong><br/>
                    ${reason}
                </p>
            </div>
            ` : ''}

            <p style="margin: 20px 0 0 0; font-size: 16px; color: ${COLORS.gray}; line-height: 1.7;">
                Si vous pensez qu'il y a une erreur ou si vous souhaitez plus d'informations, n'hésitez pas à nous contacter. Nous serons heureux de vous aider.
            </p>
        `;

        const html = generateEmailTemplate({
            title: subject,
            preheader: 'Information concernant votre demande d\'inscription',
            content,
            ctaText: 'Nous contacter',
            ctaUrl: `${FRONTEND_URL}/contact`,
            footerText: 'L\'équipe Vizion Academy reste à votre disposition pour toute question.'
        });

        const result = await sendEmail(user.email, subject, html);

        if (result.success) {
            await prisma.notification.update({
                where: { id: notification.id },
                data: { emailSent: true, emailSentAt: new Date() },
            });
        }
    }

    return notification;
}

/**
 * Notifie tous les intervenants approuvés d'une nouvelle mission
 */
export async function notifyIntervenantsNewMission(mission) {
    try {
        // Récupérer tous les intervenants approuvés
        const intervenants = await prisma.intervenant.findMany({
            where: { status: 'approved' },
            select: {
                id: true,
                userId: true,
                firstName: true,
                user: { select: { email: true } }
            },
        });

        const ecoleName = mission.ecole?.name || 'Une école';
        const missionTitle = mission.title || 'Nouvelle mission';

        for (const intervenant of intervenants) {
            // Créer la notification en base
            const notification = await prisma.notification.create({
                data: {
                    userId: intervenant.userId,
                    type: NotificationTypes.MISSION_CREATED,
                    title: 'Nouvelle mission disponible',
                    message: `${ecoleName} vient de publier une nouvelle mission : "${missionTitle}"`,
                    data: { missionId: mission.id, missionTitle, ecoleName },
                },
            });

            // Envoyer l'email personnalisé
            if (intervenant.user?.email) {
                const subject = '📋 Nouvelle mission disponible sur Vizion Academy';
                const firstName = intervenant.firstName || 'Intervenant';

                const content = `
                    <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: ${COLORS.primary};">
                        Bonjour ${firstName},
                    </h2>

                    <p style="margin: 0 0 20px 0; font-size: 16px; color: ${COLORS.gray}; line-height: 1.7;">
                        Une nouvelle mission vient d'être publiée sur Vizion Academy et pourrait vous intéresser !
                    </p>

                    <div style="background: linear-gradient(135deg, ${COLORS.light} 0%, #ffffff 100%); border-radius: 12px; padding: 25px; margin: 20px 0; border: 1px solid ${COLORS.light};">
                        <h3 style="margin: 0 0 10px 0; font-size: 20px; color: ${COLORS.primary};">
                            ${missionTitle}
                        </h3>
                        <p style="margin: 0 0 15px 0; font-size: 14px; color: ${COLORS.secondary};">
                            Publiée par <strong>${ecoleName}</strong>
                        </p>
                        ${mission.description ? `
                        <p style="margin: 0; font-size: 14px; color: ${COLORS.gray}; line-height: 1.6;">
                            ${mission.description.substring(0, 200)}${mission.description.length > 200 ? '...' : ''}
                        </p>
                        ` : ''}
                    </div>

                    ${mission.startDate || mission.endDate || mission.tarifJournalier ? `
                    ${generateInfoBox([
                        ...(mission.startDate ? [{ label: 'Date de début', value: new Date(mission.startDate).toLocaleDateString('fr-FR') }] : []),
                        ...(mission.endDate ? [{ label: 'Date de fin', value: new Date(mission.endDate).toLocaleDateString('fr-FR') }] : []),
                        ...(mission.tarifJournalier ? [{ label: 'Tarif journalier', value: `${mission.tarifJournalier} €` }] : [])
                    ])}
                    ` : ''}

                    <p style="margin: 25px 0 0 0; font-size: 14px; color: ${COLORS.secondary}; text-align: center;">
                        Ne tardez pas à postuler, les places sont limitées !
                    </p>
                `;

                const html = generateEmailTemplate({
                    title: subject,
                    preheader: `Nouvelle mission : ${missionTitle} - ${ecoleName}`,
                    content,
                    ctaText: 'Voir la mission et postuler',
                    ctaUrl: `${FRONTEND_URL}/missions/${mission.id}`,
                    footerText: 'Vous recevez cet email car vous êtes inscrit comme intervenant sur Vizion Academy.'
                });

                const result = await sendEmail(intervenant.user.email, subject, html);

                if (result.success) {
                    await prisma.notification.update({
                        where: { id: notification.id },
                        data: { emailSent: true, emailSentAt: new Date() },
                    });
                }
            }
        }

        logger.info('Intervenants notified of new mission', {
            missionId: mission.id,
            intervenantCount: intervenants.length
        });
    } catch (error) {
        logger.error('Failed to notify intervenants of new mission', { error: error.message });
    }
}

/**
 * Notifie une école qu'un intervenant a postulé à sa mission
 */
export async function notifySchoolNewCandidature(candidature) {
    try {
        const ecoleUserId = candidature.mission?.ecole?.user?.id;
        if (!ecoleUserId) {
            logger.warn('Cannot notify school: ecole user not found', { candidatureId: candidature.id });
            return;
        }

        const intervenantName = [
            candidature.intervenant?.firstName,
            candidature.intervenant?.lastName
        ].filter(Boolean).join(' ') || 'Un intervenant';

        const missionTitle = candidature.mission?.title || 'votre mission';
        const ecoleName = candidature.mission?.ecole?.name || 'École';

        // Créer la notification en base
        const notification = await prisma.notification.create({
            data: {
                userId: ecoleUserId,
                type: NotificationTypes.APPLICATION_RECEIVED,
                title: 'Nouvelle candidature reçue',
                message: `${intervenantName} a postulé pour "${missionTitle}"`,
                data: {
                    candidatureId: candidature.id,
                    missionId: candidature.missionId,
                    intervenantId: candidature.intervenantId,
                    intervenantName,
                },
            },
        });

        // Récupérer l'email de l'école
        const user = await prisma.user.findUnique({
            where: { id: ecoleUserId },
            select: { email: true },
        });

        if (user?.email) {
            const subject = '👤 Nouvelle candidature pour votre mission';

            const content = `
                <div style="text-align: center; margin-bottom: 30px;">
                    ${generateStatusBadge('Nouvelle candidature', 'info')}
                </div>

                <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: ${COLORS.primary};">
                    Bonjour ${ecoleName},
                </h2>

                <p style="margin: 0 0 20px 0; font-size: 16px; color: ${COLORS.gray}; line-height: 1.7;">
                    Bonne nouvelle ! Un intervenant vient de postuler à l'une de vos missions.
                </p>

                <div style="background: linear-gradient(135deg, ${COLORS.light} 0%, #ffffff 100%); border-radius: 12px; padding: 25px; margin: 20px 0; border: 1px solid ${COLORS.light};">
                    <div style="display: flex; align-items: center; margin-bottom: 15px;">
                        <div style="width: 50px; height: 50px; background: linear-gradient(135deg, ${COLORS.secondary} 0%, ${COLORS.primary} 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                            <span style="color: white; font-size: 20px; font-weight: bold;">${intervenantName.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                            <h3 style="margin: 0; font-size: 18px; color: ${COLORS.primary};">${intervenantName}</h3>
                            <p style="margin: 5px 0 0 0; font-size: 14px; color: ${COLORS.gray};">Candidat pour votre mission</p>
                        </div>
                    </div>
                </div>

                ${generateInfoBox([
                    { label: 'Mission', value: missionTitle },
                    { label: 'Date de candidature', value: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) }
                ])}

                <p style="margin: 25px 0 0 0; font-size: 14px; color: ${COLORS.gray}; line-height: 1.6; padding: 15px; background-color: ${COLORS.light}; border-radius: 8px; border-left: 4px solid ${COLORS.secondary};">
                    <strong>Conseil :</strong> Consultez le profil complet du candidat pour découvrir son parcours, ses compétences et ses disponibilités.
                </p>
            `;

            const html = generateEmailTemplate({
                title: subject,
                preheader: `${intervenantName} a postulé pour "${missionTitle}"`,
                content,
                ctaText: 'Voir la candidature',
                ctaUrl: `${FRONTEND_URL}/dashboard/missions/${candidature.missionId}`,
                footerText: 'Vous recevez cet email car une candidature a été soumise pour l\'une de vos missions.'
            });

            const result = await sendEmail(user.email, subject, html);

            if (result.success) {
                await prisma.notification.update({
                    where: { id: notification.id },
                    data: { emailSent: true, emailSentAt: new Date() },
                });
            }
        }

        return notification;
    } catch (error) {
        logger.error('Failed to notify school of new candidature', { error: error.message });
    }
}

/**
 * Notifie un intervenant que sa candidature a été refusée
 */
export async function notifyApplicationRejected(intervenantUserId, missionTitle, ecoleName) {
    // Créer la notification en base
    const notification = await prisma.notification.create({
        data: {
            userId: intervenantUserId,
            type: NotificationTypes.APPLICATION_REJECTED,
            title: 'Candidature non retenue',
            message: `Votre candidature pour "${missionTitle}" n'a pas été retenue.`,
            data: { missionTitle, ecoleName },
        },
    });

    // Récupérer l'email de l'utilisateur
    const user = await prisma.user.findUnique({
        where: { id: intervenantUserId },
        select: { email: true },
        include: { intervenant: { select: { firstName: true } } }
    });

    if (user?.email) {
        const firstName = user.intervenant?.firstName || 'Intervenant';
        const subject = 'Information sur votre candidature';

        const content = `
            <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: ${COLORS.primary};">
                Bonjour ${firstName},
            </h2>

            <p style="margin: 0 0 20px 0; font-size: 16px; color: ${COLORS.gray}; line-height: 1.7;">
                Nous vous informons que votre candidature pour la mission suivante n'a pas été retenue :
            </p>

            <div style="background-color: ${COLORS.light}; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <p style="margin: 0 0 5px 0; font-size: 18px; font-weight: 600; color: ${COLORS.primary};">
                    ${missionTitle}
                </p>
                <p style="margin: 0; font-size: 14px; color: ${COLORS.gray};">
                    École : ${ecoleName}
                </p>
            </div>

            <p style="margin: 0 0 20px 0; font-size: 16px; color: ${COLORS.gray}; line-height: 1.7;">
                Ne vous découragez pas ! De nombreuses autres missions sont disponibles sur la plateforme et correspondent peut-être mieux à votre profil.
            </p>

            <div style="background: linear-gradient(135deg, ${COLORS.accent}20 0%, ${COLORS.light} 100%); border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
                <p style="margin: 0; font-size: 16px; color: ${COLORS.primary}; font-weight: 500;">
                    💡 Astuce : Complétez votre profil pour augmenter vos chances !
                </p>
            </div>
        `;

        const html = generateEmailTemplate({
            title: subject,
            preheader: 'Information concernant votre candidature',
            content,
            ctaText: 'Découvrir d\'autres missions',
            ctaUrl: `${FRONTEND_URL}/missions`,
            footerText: 'N\'hésitez pas à postuler à d\'autres missions qui correspondent à vos compétences.'
        });

        const result = await sendEmail(user.email, subject, html);

        if (result.success) {
            await prisma.notification.update({
                where: { id: notification.id },
                data: { emailSent: true, emailSentAt: new Date() },
            });
        }
    }

    return notification;
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
    notifyAdminNewIntervenantRegistration,
    notifyIntervenantApproved,
    notifyIntervenantRejected,
    notifyIntervenantsNewMission,
    notifySchoolNewCandidature,
    notifyApplicationRejected,
    getUnreadNotifications,
    markAsRead,
    markAllAsRead,
    NotificationTypes,
};
