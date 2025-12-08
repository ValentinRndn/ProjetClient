/**
 * ============================================
 * Vizion Academy - Service des Écoles
 * CDC : Gestion des écoles (renommé de School à Ecole)
 * ============================================
 */

import prisma from "../../prisma.js";

/**
 * findAllPublic - Liste publique des écoles (pour filtres)
 * Retourne seulement id et name
 */
export async function findAllPublic() {
  return prisma.ecole.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: "asc" },
  });
}

/**
 * findAll - Liste toutes les écoles (ADMIN)
 */
export async function findAll({ take = 50, skip = 0 } = {}) {
  return prisma.ecole.findMany({
    take,
    skip,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, email: true, role: true },
      },
    },
  });
}

/**
 * findById - Trouve une école par son ID
 */
export async function findById(id) {
  return prisma.ecole.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, email: true, role: true },
      },
      missions: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });
}

/**
 * findByUserId - Trouve une école par son userId
 */
export async function findByUserId(userId) {
  return prisma.ecole.findUnique({
    where: { userId },
    include: {
      user: {
        select: { id: true, email: true, role: true },
      },
      missions: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });
}

/**
 * create - Crée une nouvelle école (liée à un user existant)
 */
export async function create(data, userId) {
  return prisma.ecole.create({
    data: {
      name: data.name,
      contactEmail: data.contactEmail ?? null,
      address: data.address ?? null,
      phone: data.phone ?? null,
      userId: userId,
    },
    include: {
      user: {
        select: { id: true, email: true, role: true },
      },
    },
  });
}

/**
 * update - Met à jour une école
 */
export async function update(id, payload) {
  const ecole = await prisma.ecole.findUnique({ where: { id } });
  if (!ecole) return null;

  return prisma.ecole.update({
    where: { id },
    data: {
      name: payload.name ?? ecole.name,
      contactEmail: payload.contactEmail ?? ecole.contactEmail,
      address: payload.address ?? ecole.address,
      phone: payload.phone ?? ecole.phone,
    },
    include: {
      user: {
        select: { id: true, email: true, role: true },
      },
    },
  });
}

/**
 * remove - Supprime une école
 */
export async function remove(id) {
  return prisma.ecole.delete({ where: { id } });
}

/**
 * getDashboard - Métriques du tableau de bord école
 */
export async function getDashboard(ecoleId) {
  const ecole = await prisma.ecole.findUnique({ where: { id: ecoleId } });
  if (!ecole) {
    const err = new Error("École non trouvée.");
    err.status = 404;
    throw err;
  }

  const totalMissions = await prisma.mission.count({ where: { ecoleId } });

  // Missions par statut (MVP: DRAFT, ACTIVE, COMPLETED)
  const statuses = ["DRAFT", "ACTIVE", "COMPLETED"];
  const missionsByStatus = {};
  await Promise.all(
    statuses.map(async (s) => {
      missionsByStatus[s] = await prisma.mission.count({
        where: { ecoleId, status: s },
      });
    })
  );

  const recentMissions = await prisma.mission.findMany({
    where: { ecoleId },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      intervenant: {
        select: {
          id: true,
          bio: true,
          user: { select: { email: true } },
        },
      },
    },
  });

  return {
    ecole: {
      id: ecole.id,
      name: ecole.name,
      contactEmail: ecole.contactEmail,
    },
    totalMissions,
    missionsByStatus,
    recentMissions,
  };
}

/**
 * declareMission - Crée une mission pour une école (CDC)
 */
export async function declareMission(ecoleId, payload, user) {
  const ecole = await prisma.ecole.findUnique({ where: { id: ecoleId } });
  if (!ecole) {
    const err = new Error("École non trouvée.");
    err.status = 404;
    throw err;
  }

  if (!payload.title) {
    const err = new Error("Le titre est requis.");
    err.status = 400;
    throw err;
  }

  const missionData = {
    ecoleId,
    title: payload.title,
    description: payload.description ?? null,
    startDate: payload.startDate ? new Date(payload.startDate) : null,
    endDate: payload.endDate ? new Date(payload.endDate) : null,
    intervenantId: payload.intervenantId ?? null,
    priceCents: payload.priceCents ? Number(payload.priceCents) : null,
    status: "DRAFT", // MVP: toujours DRAFT à la création
  };

  return prisma.mission.create({
    data: missionData,
    include: {
      ecole: { select: { id: true, name: true } },
      intervenant: { select: { id: true, user: { select: { email: true } } } },
    },
  });
}
