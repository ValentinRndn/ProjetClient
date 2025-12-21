/**
 * Service de gestion des Challenges pédagogiques
 * - Seuls les admins peuvent créer/modifier/supprimer des challenges
 * - Système de brouillon (draft) / publié (published)
 * - Seuls les challenges publiés sont visibles publiquement
 */

import prisma from '../../prisma.js';

/**
 * Créer un nouveau challenge (admin uniquement)
 */
export async function createChallenge(data) {
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
      status: data.status || 'draft',
      publishedAt: data.status === 'published' ? new Date() : null,
      // Nouveaux champs
      tags: data.tags || [],
      schedule: data.schedule || null,
      requirements: data.requirements || null,
      highlights: data.highlights || [],
      conclusion: data.conclusion || [],
      galleryImages: data.galleryImages || [],
    },
  });

  return challenge;
}

/**
 * Récupérer les challenges publics (publiés et not_ready)
 * Les challenges not_ready apparaissent en fin de liste
 */
export async function getPublicChallenges(filters = {}) {
  const where = {
    status: { in: ['published', 'not_ready'] },
  };

  if (filters.thematique) {
    where.thematique = filters.thematique;
  }

  const challenges = await prisma.challenge.findMany({
    where,
    orderBy: { publishedAt: 'desc' },
  });

  // Trier pour mettre les not_ready en fin de liste
  return challenges.sort((a, b) => {
    if (a.status === 'not_ready' && b.status !== 'not_ready') return 1;
    if (a.status !== 'not_ready' && b.status === 'not_ready') return -1;
    return 0; // Garder l'ordre par publishedAt pour les challenges du même type
  });
}

/**
 * Récupérer un challenge par ID (public si publié, sinon admin requis)
 */
export async function getChallengeById(id, userRole = null) {
  const challenge = await prisma.challenge.findUnique({
    where: { id },
  });

  if (!challenge) {
    const err = new Error('Challenge non trouvé');
    err.status = 404;
    throw err;
  }

  // Vérifier l'accès
  const isAdmin = userRole === 'ADMIN';
  const isPubliclyVisible = challenge.status === 'published' || challenge.status === 'not_ready';

  if (!isPubliclyVisible && !isAdmin) {
    const err = new Error('Accès non autorisé');
    err.status = 403;
    throw err;
  }

  return challenge;
}

/**
 * Mettre à jour un challenge (admin uniquement)
 */
export async function updateChallenge(id, data) {
  const challenge = await prisma.challenge.findUnique({
    where: { id },
  });

  if (!challenge) {
    const err = new Error('Challenge non trouvé');
    err.status = 404;
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
  // Gestion du statut
  if (data.status !== undefined) {
    updateData.status = data.status;
    // Mettre à jour publishedAt selon le statut
    if (data.status === 'published' || data.status === 'not_ready') {
      // Ne définir publishedAt que s'il n'existe pas déjà
      if (!challenge.publishedAt) {
        updateData.publishedAt = new Date();
      }
    } else if (data.status === 'draft') {
      updateData.publishedAt = null;
    }
  }
  // Nouveaux champs
  if (data.tags !== undefined) updateData.tags = data.tags;
  if (data.schedule !== undefined) updateData.schedule = data.schedule;
  if (data.requirements !== undefined) updateData.requirements = data.requirements;
  if (data.highlights !== undefined) updateData.highlights = data.highlights;
  if (data.conclusion !== undefined) updateData.conclusion = data.conclusion;
  if (data.galleryImages !== undefined) updateData.galleryImages = data.galleryImages;

  const updated = await prisma.challenge.update({
    where: { id },
    data: updateData,
  });

  return updated;
}

/**
 * Supprimer un challenge (admin uniquement)
 */
export async function deleteChallenge(id) {
  const challenge = await prisma.challenge.findUnique({
    where: { id },
  });

  if (!challenge) {
    const err = new Error('Challenge non trouvé');
    err.status = 404;
    throw err;
  }

  await prisma.challenge.delete({ where: { id } });

  return { success: true };
}

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
    orderBy: { updatedAt: 'desc' },
  });

  return challenges;
}

/**
 * Publier un challenge (admin uniquement)
 */
export async function publishChallenge(id) {
  const challenge = await prisma.challenge.findUnique({
    where: { id },
  });

  if (!challenge) {
    const err = new Error('Challenge non trouvé');
    err.status = 404;
    throw err;
  }

  if (challenge.status === 'published') {
    const err = new Error('Ce challenge est déjà publié');
    err.status = 400;
    throw err;
  }

  const updated = await prisma.challenge.update({
    where: { id },
    data: {
      status: 'published',
      publishedAt: new Date(),
    },
  });

  return updated;
}

/**
 * Dépublier un challenge (passer en brouillon) (admin uniquement)
 */
export async function unpublishChallenge(id) {
  const challenge = await prisma.challenge.findUnique({
    where: { id },
  });

  if (!challenge) {
    const err = new Error('Challenge non trouvé');
    err.status = 404;
    throw err;
  }

  if (challenge.status === 'draft') {
    const err = new Error('Ce challenge est déjà en brouillon');
    err.status = 400;
    throw err;
  }

  const updated = await prisma.challenge.update({
    where: { id },
    data: {
      status: 'draft',
      publishedAt: null,
    },
  });

  return updated;
}

/**
 * Statistiques des challenges (admin)
 */
export async function getChallengeStats() {
  const [total, draft, published, notReady] = await Promise.all([
    prisma.challenge.count(),
    prisma.challenge.count({ where: { status: 'draft' } }),
    prisma.challenge.count({ where: { status: 'published' } }),
    prisma.challenge.count({ where: { status: 'not_ready' } }),
  ]);

  return {
    total,
    draft,
    published,
    notReady,
  };
}
