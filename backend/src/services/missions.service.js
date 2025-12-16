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
 * @param {Object} payload - { title, description?, startDate?, endDate?, priceCents?, ecoleId? }
 * @param {string} userId - ID de l'utilisateur école ou admin
 */
export async function createByEcole(payload, userId) {
    // Récupérer l'utilisateur pour vérifier son rôle
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
    });

    let ecoleId = null;

    // Si c'est un ADMIN, on peut spécifier l'ecoleId ou créer sans école
    if (user?.role === 'ADMIN') {
        ecoleId = payload.ecoleId || null;
    } else {
        // Sinon, trouver l'école associée à cet utilisateur
        const ecole = await prisma.ecole.findUnique({
            where: { userId }
        });

        if (!ecole) {
            const err = new Error('École non trouvée pour cet utilisateur.');
            err.status = 404;
            throw err;
        }
        ecoleId = ecole.id;
    }

    const data = {
        ecoleId,
        title: payload.title,
        description: payload.description || null,
        status: payload.status || 'ACTIVE', // Missions publiées directement
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

/**
 * applyToMission - Permet à un intervenant de postuler à une mission (crée une candidature)
 * @param {string} missionId - ID de la mission
 * @param {string} userId - ID de l'utilisateur intervenant
 * @param {Object} data - Données de candidature (message, tarifPropose)
 */
export async function applyToMission(missionId, userId, data = {}) {
    // Trouver l'intervenant associé à cet utilisateur
    const intervenant = await prisma.intervenant.findUnique({
        where: { userId }
    });

    if (!intervenant) {
        const err = new Error('Intervenant non trouvé pour cet utilisateur.');
        err.status = 404;
        throw err;
    }

    // Vérifier que l'intervenant est approuvé
    if (intervenant.status !== 'approved') {
        const err = new Error('Votre profil doit être approuvé pour postuler à une mission.');
        err.status = 403;
        throw err;
    }

    // Trouver la mission
    const mission = await prisma.mission.findUnique({ where: { id: missionId } });

    if (!mission) {
        const err = new Error('Mission non trouvée.');
        err.status = 404;
        throw err;
    }

    // Vérifier que la mission est active
    if (mission.status !== 'ACTIVE') {
        const err = new Error('Cette mission n\'est plus disponible.');
        err.status = 400;
        throw err;
    }

    // Vérifier qu'aucun intervenant n'est déjà assigné
    if (mission.intervenantId) {
        const err = new Error('Un intervenant est déjà assigné à cette mission.');
        err.status = 400;
        throw err;
    }

    // Vérifier si l'intervenant a déjà postulé
    const existingCandidature = await prisma.candidature.findUnique({
        where: {
            missionId_intervenantId: {
                missionId,
                intervenantId: intervenant.id
            }
        }
    });

    if (existingCandidature) {
        const err = new Error('Vous avez déjà postulé à cette mission.');
        err.status = 400;
        throw err;
    }

    // Créer la candidature
    const candidature = await prisma.candidature.create({
        data: {
            missionId,
            intervenantId: intervenant.id,
            message: data.message || null,
            tarifPropose: data.tarifPropose ? Number(data.tarifPropose) : null,
            status: 'en_attente'
        },
        include: {
            mission: {
                select: {
                    id: true,
                    title: true,
                    ecole: { select: { id: true, name: true, contactEmail: true } }
                }
            },
            intervenant: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    profileImage: true,
                    expertises: true,
                    user: { select: { id: true, email: true } }
                }
            }
        }
    });

    return candidature;
}

/**
 * getCandidatures - Récupère les candidatures d'une mission (pour l'école)
 * @param {string} missionId - ID de la mission
 * @param {string} userId - ID de l'utilisateur (pour vérifier les droits)
 */
export async function getCandidatures(missionId, userId) {
    // Vérifier que la mission existe et appartient à l'utilisateur
    const mission = await prisma.mission.findUnique({
        where: { id: missionId },
        include: {
            ecole: { select: { userId: true } }
        }
    });

    if (!mission) {
        const err = new Error('Mission non trouvée.');
        err.status = 404;
        throw err;
    }

    // Vérifier que l'utilisateur est l'école propriétaire ou admin
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.role !== 'ADMIN' && mission.ecole.userId !== userId) {
        const err = new Error('Vous n\'avez pas accès aux candidatures de cette mission.');
        err.status = 403;
        throw err;
    }

    const candidatures = await prisma.candidature.findMany({
        where: { missionId },
        orderBy: { createdAt: 'desc' },
        include: {
            intervenant: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    profileImage: true,
                    bio: true,
                    expertises: true,
                    city: true,
                    yearsExperience: true,
                    user: { select: { email: true } }
                }
            }
        }
    });

    return candidatures;
}

/**
 * acceptCandidature - L'école accepte une candidature (assigne l'intervenant)
 * @param {string} candidatureId - ID de la candidature
 * @param {string} userId - ID de l'utilisateur école
 */
export async function acceptCandidature(candidatureId, userId) {
    const candidature = await prisma.candidature.findUnique({
        where: { id: candidatureId },
        include: {
            mission: {
                include: {
                    ecole: { select: { userId: true } }
                }
            }
        }
    });

    if (!candidature) {
        const err = new Error('Candidature non trouvée.');
        err.status = 404;
        throw err;
    }

    // Vérifier les droits
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.role !== 'ADMIN' && candidature.mission.ecole.userId !== userId) {
        const err = new Error('Vous n\'avez pas le droit d\'accepter cette candidature.');
        err.status = 403;
        throw err;
    }

    // Vérifier que la mission n'a pas déjà un intervenant
    if (candidature.mission.intervenantId) {
        const err = new Error('Un intervenant est déjà assigné à cette mission.');
        err.status = 400;
        throw err;
    }

    // Transaction : accepter la candidature, refuser les autres, assigner l'intervenant
    const result = await prisma.$transaction(async (tx) => {
        // 1. Mettre à jour la candidature acceptée
        await tx.candidature.update({
            where: { id: candidatureId },
            data: { status: 'acceptee' }
        });

        // 2. Refuser toutes les autres candidatures de cette mission
        await tx.candidature.updateMany({
            where: {
                missionId: candidature.missionId,
                id: { not: candidatureId },
                status: 'en_attente'
            },
            data: { status: 'refusee' }
        });

        // 3. Assigner l'intervenant à la mission
        const updatedMission = await tx.mission.update({
            where: { id: candidature.missionId },
            data: { intervenantId: candidature.intervenantId },
            include: {
                ecole: { select: { id: true, name: true, contactEmail: true } },
                intervenant: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        user: { select: { email: true } }
                    }
                },
                candidatures: {
                    include: {
                        intervenant: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                }
            }
        });

        return updatedMission;
    });

    return result;
}

/**
 * rejectCandidature - L'école refuse une candidature
 * @param {string} candidatureId - ID de la candidature
 * @param {string} userId - ID de l'utilisateur école
 */
export async function rejectCandidature(candidatureId, userId) {
    const candidature = await prisma.candidature.findUnique({
        where: { id: candidatureId },
        include: {
            mission: {
                include: {
                    ecole: { select: { userId: true } }
                }
            }
        }
    });

    if (!candidature) {
        const err = new Error('Candidature non trouvée.');
        err.status = 404;
        throw err;
    }

    // Vérifier les droits
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.role !== 'ADMIN' && candidature.mission.ecole.userId !== userId) {
        const err = new Error('Vous n\'avez pas le droit de refuser cette candidature.');
        err.status = 403;
        throw err;
    }

    const updated = await prisma.candidature.update({
        where: { id: candidatureId },
        data: { status: 'refusee' },
        include: {
            intervenant: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    user: { select: { email: true } }
                }
            }
        }
    });

    return updated;
}

/**
 * withdrawCandidature - L'intervenant retire sa candidature
 * @param {string} candidatureId - ID de la candidature
 * @param {string} userId - ID de l'utilisateur intervenant
 */
export async function withdrawCandidature(candidatureId, userId) {
    const intervenant = await prisma.intervenant.findUnique({
        where: { userId }
    });

    if (!intervenant) {
        const err = new Error('Intervenant non trouvé.');
        err.status = 404;
        throw err;
    }

    const candidature = await prisma.candidature.findUnique({
        where: { id: candidatureId }
    });

    if (!candidature) {
        const err = new Error('Candidature non trouvée.');
        err.status = 404;
        throw err;
    }

    if (candidature.intervenantId !== intervenant.id) {
        const err = new Error('Vous ne pouvez retirer que vos propres candidatures.');
        err.status = 403;
        throw err;
    }

    if (candidature.status !== 'en_attente') {
        const err = new Error('Vous ne pouvez retirer qu\'une candidature en attente.');
        err.status = 400;
        throw err;
    }

    const updated = await prisma.candidature.update({
        where: { id: candidatureId },
        data: { status: 'retiree' }
    });

    return updated;
}

/**
 * getMyCandidatures - Récupère les candidatures d'un intervenant
 * @param {string} userId - ID de l'utilisateur intervenant
 */
export async function getMyCandidatures(userId) {
    const intervenant = await prisma.intervenant.findUnique({
        where: { userId }
    });

    if (!intervenant) {
        const err = new Error('Intervenant non trouvé.');
        err.status = 404;
        throw err;
    }

    const candidatures = await prisma.candidature.findMany({
        where: { intervenantId: intervenant.id },
        orderBy: { createdAt: 'desc' },
        include: {
            mission: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    status: true,
                    priceCents: true,
                    startDate: true,
                    endDate: true,
                    ecole: { select: { id: true, name: true } }
                }
            }
        }
    });

    return candidatures;
}
