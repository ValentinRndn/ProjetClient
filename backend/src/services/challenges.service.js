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
    },
  });

  return challenge;
}

/**
 * Récupérer les challenges publics (publiés uniquement)
 */
export async function getPublicChallenges(filters = {}) {
  const where = {
    status: 'published',
  };

  if (filters.thematique) {
    where.thematique = filters.thematique;
  }

  const challenges = await prisma.challenge.findMany({
    where,
    orderBy: { publishedAt: 'desc' },
  });

  return challenges;
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
  const isPublished = challenge.status === 'published';

  if (!isPublished && !isAdmin) {
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
    orderBy: { createdAt: 'desc' },
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
  const [total, draft, published] = await Promise.all([
    prisma.challenge.count(),
    prisma.challenge.count({ where: { status: 'draft' } }),
    prisma.challenge.count({ where: { status: 'published' } }),
  ]);

  return {
    total,
    draft,
    published,
  };
}
