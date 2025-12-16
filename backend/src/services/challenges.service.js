/**
 * Service de gestion des Challenges pédagogiques
 * - Les intervenants créent des challenges (status: pending)
 * - L'admin valide/rejette les challenges
 * - Seuls les challenges approuvés sont visibles publiquement
 */

import prisma from '../../prisma.js';

/**
 * Créer un nouveau challenge (intervenant uniquement)
 */
export async function createChallenge(data, userId) {
  // Vérifier que l'utilisateur est bien un intervenant approuvé
  const intervenant = await prisma.intervenant.findUnique({
    where: { userId },
  });

  if (!intervenant) {
    const err = new Error('Intervenant non trouvé');
    err.status = 404;
    throw err;
  }

  if (intervenant.status !== 'approved') {
    const err = new Error('Votre profil doit être approuvé pour créer un challenge');
    err.status = 403;
    throw err;
  }

  const challenge = await prisma.challenge.create({
    data: {
      title: data.title,
      description: data.description,
      shortDescription: data.shortDescription || null,
      thematique: data.thematique,
      duration: data.duration || null,
      targetAudience: data.targetAudience || null,
      objectives: data.objectives || [],
      deliverables: data.deliverables || [],
      prerequisites: data.prerequisites || null,
      imageUrl: data.imageUrl || null,
      videoUrl: data.videoUrl || null,
      priceCents: data.priceCents || null,
      intervenantId: intervenant.id,
      status: 'pending',
    },
    include: {
      intervenant: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          user: { select: { email: true } },
        },
      },
    },
  });

  return challenge;
}

/**
 * Récupérer les challenges publics (approuvés uniquement)
 */
export async function getPublicChallenges(filters = {}) {
  const where = {
    status: 'approved',
  };

  if (filters.thematique) {
    where.thematique = filters.thematique;
  }

  const challenges = await prisma.challenge.findMany({
    where,
    include: {
      intervenant: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          city: true,
          user: { select: { email: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return challenges;
}

/**
 * Récupérer un challenge par ID (public si approuvé, ou propriétaire/admin)
 */
export async function getChallengeById(id, userId = null, userRole = null) {
  const challenge = await prisma.challenge.findUnique({
    where: { id },
    include: {
      intervenant: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          city: true,
          bio: true,
          expertises: true,
          userId: true,
          user: { select: { email: true } },
        },
      },
    },
  });

  if (!challenge) {
    const err = new Error('Challenge non trouvé');
    err.status = 404;
    throw err;
  }

  // Vérifier l'accès
  const isOwner = challenge.intervenant.userId === userId;
  const isAdmin = userRole === 'ADMIN';
  const isApproved = challenge.status === 'approved';

  if (!isApproved && !isOwner && !isAdmin) {
    const err = new Error('Accès non autorisé');
    err.status = 403;
    throw err;
  }

  return challenge;
}

/**
 * Récupérer les challenges d'un intervenant
 */
export async function getMyChallenges(userId) {
  const intervenant = await prisma.intervenant.findUnique({
    where: { userId },
  });

  if (!intervenant) {
    const err = new Error('Intervenant non trouvé');
    err.status = 404;
    throw err;
  }

  const challenges = await prisma.challenge.findMany({
    where: { intervenantId: intervenant.id },
    orderBy: { createdAt: 'desc' },
  });

  return challenges;
}

/**
 * Mettre à jour un challenge (propriétaire ou admin)
 */
export async function updateChallenge(id, data, userId, userRole) {
  const challenge = await prisma.challenge.findUnique({
    where: { id },
    include: {
      intervenant: {
        select: { userId: true },
      },
    },
  });

  if (!challenge) {
    const err = new Error('Challenge non trouvé');
    err.status = 404;
    throw err;
  }

  const isOwner = challenge.intervenant.userId === userId;
  const isAdmin = userRole === 'ADMIN';

  if (!isOwner && !isAdmin) {
    const err = new Error('Accès non autorisé');
    err.status = 403;
    throw err;
  }

  // L'intervenant ne peut modifier que si le challenge est pending ou rejected
  if (isOwner && !isAdmin && challenge.status === 'approved') {
    const err = new Error('Vous ne pouvez pas modifier un challenge déjà approuvé');
    err.status = 400;
    throw err;
  }

  const updateData = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription;
  if (data.thematique !== undefined) updateData.thematique = data.thematique;
  if (data.duration !== undefined) updateData.duration = data.duration;
  if (data.targetAudience !== undefined) updateData.targetAudience = data.targetAudience;
  if (data.objectives !== undefined) updateData.objectives = data.objectives;
  if (data.deliverables !== undefined) updateData.deliverables = data.deliverables;
  if (data.prerequisites !== undefined) updateData.prerequisites = data.prerequisites;
  if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
  if (data.videoUrl !== undefined) updateData.videoUrl = data.videoUrl;
  if (data.priceCents !== undefined) updateData.priceCents = data.priceCents;

  // Si l'intervenant modifie un challenge rejeté, le repasser en pending
  if (isOwner && challenge.status === 'rejected') {
    updateData.status = 'pending';
    updateData.rejectionReason = null;
  }

  const updated = await prisma.challenge.update({
    where: { id },
    data: updateData,
    include: {
      intervenant: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          user: { select: { email: true } },
        },
      },
    },
  });

  return updated;
}

/**
 * Supprimer un challenge (propriétaire ou admin)
 */
export async function deleteChallenge(id, userId, userRole) {
  const challenge = await prisma.challenge.findUnique({
    where: { id },
    include: {
      intervenant: {
        select: { userId: true },
      },
    },
  });

  if (!challenge) {
    const err = new Error('Challenge non trouvé');
    err.status = 404;
    throw err;
  }

  const isOwner = challenge.intervenant.userId === userId;
  const isAdmin = userRole === 'ADMIN';

  if (!isOwner && !isAdmin) {
    const err = new Error('Accès non autorisé');
    err.status = 403;
    throw err;
  }

  await prisma.challenge.delete({ where: { id } });

  return { success: true };
}

// ============================================
// Fonctions Admin
// ============================================

/**
 * Récupérer tous les challenges (admin uniquement)
 */
export async function getAllChallenges(filters = {}) {
  const where = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.thematique) {
    where.thematique = filters.thematique;
  }

  const challenges = await prisma.challenge.findMany({
    where,
    include: {
      intervenant: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          user: { select: { email: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return challenges;
}

/**
 * Approuver un challenge (admin uniquement)
 */
export async function approveChallenge(id) {
  const challenge = await prisma.challenge.findUnique({
    where: { id },
  });

  if (!challenge) {
    const err = new Error('Challenge non trouvé');
    err.status = 404;
    throw err;
  }

  if (challenge.status === 'approved') {
    const err = new Error('Ce challenge est déjà approuvé');
    err.status = 400;
    throw err;
  }

  const updated = await prisma.challenge.update({
    where: { id },
    data: {
      status: 'approved',
      approvedAt: new Date(),
      rejectionReason: null,
    },
    include: {
      intervenant: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          user: { select: { email: true } },
        },
      },
    },
  });

  return updated;
}

/**
 * Rejeter un challenge (admin uniquement)
 */
export async function rejectChallenge(id, reason) {
  const challenge = await prisma.challenge.findUnique({
    where: { id },
  });

  if (!challenge) {
    const err = new Error('Challenge non trouvé');
    err.status = 404;
    throw err;
  }

  const updated = await prisma.challenge.update({
    where: { id },
    data: {
      status: 'rejected',
      rejectionReason: reason || 'Aucune raison spécifiée',
      approvedAt: null,
    },
    include: {
      intervenant: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          user: { select: { email: true } },
        },
      },
    },
  });

  return updated;
}

/**
 * Statistiques des challenges (admin)
 */
export async function getChallengeStats() {
  const [total, pending, approved, rejected] = await Promise.all([
    prisma.challenge.count(),
    prisma.challenge.count({ where: { status: 'pending' } }),
    prisma.challenge.count({ where: { status: 'approved' } }),
    prisma.challenge.count({ where: { status: 'rejected' } }),
  ]);

  return {
    total,
    pending,
    approved,
    rejected,
  };
}
