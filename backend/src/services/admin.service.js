import prisma from '../db/prisma.js';

/**
 * listUsers - pagination + recherche
 */
export async function listUsers({ take = 50, skip = 0, q = null, role = null } = {}) {
  const where = {};
  if (q) {
    where.OR = [
      { email: { contains: q, mode: 'insensitive' } },
      { name: { contains: q, mode: 'insensitive' } }
    ];
  }
  if (role) where.role = role;

  const [total, items] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      take,
      skip,
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    })
  ]);

  return { total, items };
}

/**
 * getLogs - lecture des logs d'audit
 * Ici on suppose que tu as une table 'logs' (dans ton ancien design). Si non, adapte.
 */
export async function getLogs({ take = 100, skip = 0, q = null } = {}) {
  // si tu n'as pas de modèle logs en prisma, tu peux créer une table "Log" et l'ajouter au schema.
  // Ici on gère au mieux si la table existe
  try {
    const where = {};
    if (q) {
      where.OR = [
        { action: { contains: q, mode: 'insensitive' } },
        { meta: { contains: q, mode: 'insensitive' } }
      ];
    }

    const [total, items] = await Promise.all([
      prisma.log ? prisma.log.count({ where }) : 0,
      prisma.log
        ? prisma.log.findMany({
            where,
            take,
            skip,
            orderBy: { createdAt: 'desc' }
          })
        : []
    ]);

    return { total, items };
  } catch (err) {
    // si la table logs n'existe pas, renvoyer vide (évite crash)
    return { total: 0, items: [] };
  }
}

/**
 * validateIntervenant - set status + journaliser action
 */
export async function validateIntervenant(intervenantId, status, reason = null, actor) {
  const interv = await prisma.intervenant.findUnique({ where: { id: intervenantId } });
  if (!interv) {
    const e = new Error('Intervenant not found');
    e.status = 404;
    throw e;
  }

  const updated = await prisma.intervenant.update({
    where: { id: intervenantId },
    data: {
      status
    },
    include: {
      user: { select: { id: true, email: true, name: true } }
    }
  });

  // Auditer l'action (si table log présente)
  if (prisma.log) {
    await prisma.log.create({
      data: {
        actorId: actor?.id ?? null,
        action: 'intervenant.validate',
        resourceType: 'Intervenant',
        resourceId: intervenantId,
        meta: JSON.stringify({ status, reason }),
      }
    });
  }

  // Optionnel: envoyer email/notification
  return updated;
}

/**
 * createExport - enregistre un export à exécuter par un worker
 * ici on simule: on crée l'enregistrement et laisse un champ status = 'pending'
 */
export async function createExport(resource, filters = {}, actor) {
  // Si tu as un modèle Export dans Prisma, utilise-le. Sinon on crée une table simple:
  if (!prisma.export) {
    // fallback: on renvoie un objet simulé
    const id = `exp_${Date.now()}`;
    // idempotence / persistance à implémenter selon ton infra (S3 + DB)
    return { id, resource, filters, status: 'pending', createdAt: new Date().toISOString() };
  }

  const rec = await prisma.export.create({
    data: {
      resource,
      filters: JSON.stringify(filters),
      status: 'pending',
      requestedBy: actor?.id ?? null
    }
  });

  // ici tu peux push un job dans la queue pour générer l'export
  return rec;
}

/**
 * getExport - lire un export par id
 */
export async function getExport(id) {
  if (!prisma.export) {
    return null;
  }
  return prisma.export.findUnique({ where: { id } });
}

/**
 * getStats - quelques aggregations utiles
 */
export async function getStats() {
  // compter users, intervenants, schools, missions
  const [usersCount, intervenantsCount, schoolsCount, missionsCount] = await Promise.all([
    prisma.user.count(),
    prisma.intervenant.count(),
    prisma.school.count(),
    prisma.mission.count()
  ]);

  // missions by status
  const statuses = ['proposed', 'confirmed', 'active', 'completed', 'cancelled'];
  const missionsByStatus = {};
  await Promise.all(statuses.map(async (s) => {
    missionsByStatus[s] = await prisma.mission.count({ where: { status: s } });
  }));

  return { usersCount, intervenantsCount, schoolsCount, missionsCount, missionsByStatus };
}

/**
 * reloadCache - placeholder pour invalider caches (Redis, in-memory)
 */
export async function reloadCache() {
  // example: if you use Redis, flush keys or call cacheService.reload()
  // Ici noop
  return true;
}
