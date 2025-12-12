/**
 * ============================================
 * Vizion Academy - Service de logs de documents
 * Journal des téléchargements et accès
 * ============================================
 */

import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger.js';

const prisma = new PrismaClient();

/**
 * Enregistre un log de téléchargement de document
 * @param {Object} data - Données du log
 * @param {string} data.documentId - ID du document
 * @param {string|null} data.userId - ID de l'utilisateur (null si accès public)
 * @param {string|null} data.userRole - Rôle de l'utilisateur
 * @param {string|null} data.userEmail - Email de l'utilisateur
 * @param {string|null} data.ipAddress - Adresse IP
 * @param {string|null} data.userAgent - User Agent du navigateur
 * @param {string} data.action - Type d'action (download, view, preview)
 */
export async function logDocumentAccess({
  documentId,
  userId = null,
  userRole = null,
  userEmail = null,
  ipAddress = null,
  userAgent = null,
  action = 'download',
}) {
  try {
    const log = await prisma.documentDownloadLog.create({
      data: {
        documentId,
        userId,
        userRole,
        userEmail,
        ipAddress,
        userAgent,
        action,
      },
    });

    logger.info('Document access logged', {
      logId: log.id,
      documentId,
      userId,
      action,
    });

    return log;
  } catch (error) {
    // Ne pas faire échouer le téléchargement si le log échoue
    logger.error('Failed to log document access', {
      documentId,
      error: error.message,
    });
    return null;
  }
}

/**
 * Récupère les logs de téléchargement d'un document
 * @param {string} documentId - ID du document
 * @param {Object} options - Options de pagination
 */
export async function getDocumentLogs(documentId, { page = 1, limit = 20 } = {}) {
  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    prisma.documentDownloadLog.findMany({
      where: { documentId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    }),
    prisma.documentDownloadLog.count({ where: { documentId } }),
  ]);

  return {
    data: logs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Récupère tous les logs de documents d'un intervenant
 * @param {string} intervenantId - ID de l'intervenant
 * @param {Object} options - Options de pagination et filtres
 */
export async function getIntervenantDocumentLogs(intervenantId, {
  page = 1,
  limit = 20,
  startDate,
  endDate,
  action,
} = {}) {
  const skip = (page - 1) * limit;

  // Construire les filtres
  const where = {
    document: {
      intervenantId,
    },
  };

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  if (action) {
    where.action = action;
  }

  const [logs, total] = await Promise.all([
    prisma.documentDownloadLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        document: {
          select: {
            id: true,
            fileName: true,
            type: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    }),
    prisma.documentDownloadLog.count({ where }),
  ]);

  return {
    data: logs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Récupère des statistiques sur les téléchargements
 * @param {string} intervenantId - ID de l'intervenant (optionnel)
 */
export async function getDownloadStats(intervenantId = null) {
  const where = intervenantId ? { document: { intervenantId } } : {};

  const [totalDownloads, downloadsByRole, downloadsByType, recentActivity] = await Promise.all([
    // Total des téléchargements
    prisma.documentDownloadLog.count({ where }),

    // Téléchargements par rôle
    prisma.documentDownloadLog.groupBy({
      by: ['userRole'],
      where,
      _count: { id: true },
    }),

    // Téléchargements par type de document
    prisma.documentDownloadLog.findMany({
      where,
      select: {
        document: {
          select: {
            type: true,
          },
        },
      },
    }).then(logs => {
      const counts = {};
      logs.forEach(log => {
        const type = log.document?.type || 'UNKNOWN';
        counts[type] = (counts[type] || 0) + 1;
      });
      return counts;
    }),

    // Activité récente (dernières 24h)
    prisma.documentDownloadLog.count({
      where: {
        ...where,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    }),
  ]);

  return {
    totalDownloads,
    downloadsByRole: downloadsByRole.reduce((acc, item) => {
      acc[item.userRole || 'PUBLIC'] = item._count.id;
      return acc;
    }, {}),
    downloadsByType,
    last24Hours: recentActivity,
  };
}

export default {
  logDocumentAccess,
  getDocumentLogs,
  getIntervenantDocumentLogs,
  getDownloadStats,
};
