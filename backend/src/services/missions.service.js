/**
 * ============================================
 * Vizion Academy - Service des Missions
 * CDC : Gestion des missions (MVP)
 * Status: DRAFT, ACTIVE, COMPLETED
 * ============================================
 */

import prisma from '../../prisma.js';

/**
 * findAll - Listing avec filtres + recherche textuelle
 * @param {Object} opts - { ecoleId, intervenantId, status, q, take, skip }
 */
export async function findAll(opts = {}) {
    const { ecoleId, intervenantId, status, q, take = 50, skip = 0 } = opts;

    const where = {};
    if (ecoleId) where.ecoleId = ecoleId;
    if (intervenantId) where.intervenantId = intervenantId;
    if (status) where.status = status;
    if (q) {
        where.OR = [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } }
        ];
    }

    const [total, items] = await Promise.all([
        prisma.mission.count({ where }),
        prisma.mission.findMany({
            where,
            take,
            skip,
            orderBy: { createdAt: 'desc' },
            include: {
                ecole: { 
                    select: { 
                        id: true, 
                        name: true,
                        contactEmail: true 
                    } 
                },
                intervenant: {
                    select: {
                        id: true,
                        bio: true,
                        status: true,
                        user: { 
                            select: { 
                                id: true, 
                                email: true 
                            } 
                        }
                    }
                }
            }
        })
    ]);

    return { total, items };
}

/**
 * findByEcoleUserId - Trouve les missions d'une école par son userId (CDC)
 * @param {string} userId - ID de l'utilisateur école
 * @param {Object} queryOpts - Options de requête
 */
export async function findByEcoleUserId(userId, queryOpts = {}) {
    // Trouver l'école associée à cet utilisateur
    const ecole = await prisma.ecole.findUnique({
        where: { userId }
    });

    if (!ecole) {
        const err = new Error('École non trouvée pour cet utilisateur.');
        err.status = 404;
        throw err;
    }

    const { status, q, take = 50, skip = 0 } = queryOpts;

    const where = { ecoleId: ecole.id };
    if (status) where.status = status;
    if (q) {
        where.OR = [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } }
        ];
    }

    const [total, items] = await Promise.all([
        prisma.mission.count({ where }),
        prisma.mission.findMany({
            where,
            take: parseInt(take, 10),
            skip: parseInt(skip, 10),
            orderBy: { createdAt: 'desc' },
            include: {
                ecole: { select: { id: true, name: true } },
                intervenant: {
                    select: {
                        id: true,
                        bio: true,
                        user: { select: { id: true, email: true } }
                    }
                }
            }
        })
    ]);

    return { total, items, ecole };
}

/**
 * findByIntervenantUserId - Trouve les missions d'un intervenant par son userId (CDC)
 * @param {string} userId - ID de l'utilisateur intervenant
 * @param {Object} queryOpts - Options de requête
 */
export async function findByIntervenantUserId(userId, queryOpts = {}) {
    // Trouver l'intervenant associé à cet utilisateur
    const intervenant = await prisma.intervenant.findUnique({
        where: { userId }
    });

    if (!intervenant) {
        const err = new Error('Intervenant non trouvé pour cet utilisateur.');
        err.status = 404;
        throw err;
    }

    const { status, q, take = 50, skip = 0 } = queryOpts;

    const where = { intervenantId: intervenant.id };
    if (status) where.status = status;
    if (q) {
        where.OR = [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } }
        ];
    }

    const [total, items] = await Promise.all([
        prisma.mission.count({ where }),
        prisma.mission.findMany({
            where,
            take: parseInt(take, 10),
            skip: parseInt(skip, 10),
            orderBy: { createdAt: 'desc' },
            include: {
                ecole: { select: { id: true, name: true, contactEmail: true } },
                intervenant: {
                    select: {
                        id: true,
                        bio: true,
                        user: { select: { id: true, email: true } }
                    }
                }
            }
        })
    ]);

    return { total, items, intervenant };
}

/**
 * createByEcole - Crée une mission pour une école (CDC)
 * @param {Object} payload - { title, description?, startDate?, endDate?, priceCents? }
 * @param {string} userId - ID de l'utilisateur école
 */
export async function createByEcole(payload, userId) {
    // Trouver l'école associée à cet utilisateur
    const ecole = await prisma.ecole.findUnique({
        where: { userId }
    });

    if (!ecole) {
        const err = new Error('École non trouvée pour cet utilisateur.');
        err.status = 404;
        throw err;
    }

    const data = {
        ecoleId: ecole.id,
        title: payload.title,
        description: payload.description || null,
        status: 'DRAFT', // Status MVP: DRAFT par défaut
        startDate: payload.startDate ? new Date(payload.startDate) : null,
        endDate: payload.endDate ? new Date(payload.endDate) : null,
        priceCents: payload.priceCents ? Number(payload.priceCents) : null,
    };

    const created = await prisma.mission.create({
        data,
        include: {
            ecole: { select: { id: true, name: true } },
            intervenant: {
                select: {
                    id: true,
                    user: { select: { email: true } }
                }
            }
        }
    });

    return created;
}

/**
 * findById - Trouve une mission par son ID
 */
export async function findById(id) {
    return prisma.mission.findUnique({
        where: { id },
        include: {
            ecole: { select: { id: true, name: true, contactEmail: true } },
            intervenant: {
                select: {
                    id: true,
                    bio: true,
                    user: { select: { id: true, email: true } }
                }
            }
        }
    });
}

/**
 * update - Mise à jour partielle d'une mission
 */
export async function update(id, payload, user) {
    const existing = await prisma.mission.findUnique({ where: { id } });
    if (!existing) return null;

    const data = {
        title: payload.title ?? existing.title,
        description: payload.description ?? existing.description,
        startDate: payload.startDate ? new Date(payload.startDate) : existing.startDate,
        endDate: payload.endDate ? new Date(payload.endDate) : existing.endDate,
        priceCents: payload.priceCents !== undefined ? Number(payload.priceCents) : existing.priceCents,
    };

    const updated = await prisma.mission.update({
        where: { id },
        data,
        include: {
            ecole: { select: { id: true, name: true } },
            intervenant: {
                select: {
                    id: true,
                    user: { select: { email: true } }
                }
            }
        }
    });

    return updated;
}

/**
 * changeStatus - Change le statut d'une mission (MVP: DRAFT, ACTIVE, COMPLETED)
 */
export async function changeStatus(id, newStatus, user) {
    // Status MVP autorisés
    const allowed = ['DRAFT', 'ACTIVE', 'COMPLETED'];
    if (!allowed.includes(newStatus)) {
        const err = new Error('Statut invalide. Valeurs acceptées: DRAFT, ACTIVE, COMPLETED.');
        err.status = 400;
        throw err;
    }

    const existing = await prisma.mission.findUnique({ where: { id } });
    if (!existing) {
        const err = new Error('Mission non trouvée.');
        err.status = 404;
        throw err;
    }

    const updated = await prisma.mission.update({
        where: { id },
        data: { status: newStatus },
        include: { 
            ecole: { select: { id: true, name: true } },
            intervenant: { select: { id: true, user: { select: { email: true } } } }
        }
    });

    return updated;
}

/**
 * assignIntervenant - Affecte un intervenant à une mission
 */
export async function assignIntervenant(missionId, intervenantId, user) {
    const [mission, interv] = await Promise.all([
        prisma.mission.findUnique({ where: { id: missionId } }),
        prisma.intervenant.findUnique({ where: { id: intervenantId } })
    ]);

    if (!mission) {
        const err = new Error('Mission non trouvée.');
        err.status = 404;
        throw err;
    }
    if (!interv) {
        const err = new Error('Intervenant non trouvé.');
        err.status = 404;
        throw err;
    }

    // Mise à jour de la mission avec l'intervenant
    const updated = await prisma.mission.update({
        where: { id: missionId },
        data: {
            intervenantId,
            status: mission.status === 'DRAFT' ? 'ACTIVE' : mission.status
        },
        include: {
            ecole: { select: { id: true, name: true } },
            intervenant: {
                select: {
                    id: true,
                    user: { select: { email: true } }
                }
            }
        }
    });

    return updated;
}

/**
 * remove - Supprime une mission
 */
export async function remove(id, user) {
    const existing = await prisma.mission.findUnique({ where: { id } });
    if (!existing) {
        const err = new Error('Mission non trouvée.');
        err.status = 404;
        throw err;
    }

    await prisma.mission.delete({ where: { id } });
    return;
}
