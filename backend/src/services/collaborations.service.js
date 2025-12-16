/**
 * Service de gestion des collaborations
 * Permet aux écoles et intervenants de déclarer des collaborations
 */

import prisma from '../../prisma.js';

/**
 * Génère un numéro de facture unique
 */
async function generateFactureNumero() {
  const year = new Date().getFullYear();
  const count = await prisma.facture.count({
    where: {
      numero: { startsWith: `FAC-${year}` },
    },
  });
  return `FAC-${year}-${String(count + 1).padStart(4, '0')}`;
}

/**
 * Créer une facture automatiquement pour une collaboration validée
 */
async function createFactureForCollaboration(collaboration) {
  // Ne créer la facture que s'il y a un montant défini
  if (!collaboration.montantHT || collaboration.montantHT <= 0) {
    return null;
  }

  const numero = await generateFactureNumero();
  const tva = Math.round(collaboration.montantHT * 0.20); // TVA 20%
  const montantTTC = collaboration.montantHT + tva;

  // L'intervenant facture l'école
  const facture = await prisma.facture.create({
    data: {
      numero,
      type: 'ecole',
      emetteurType: 'intervenant',
      emetteurId: collaboration.intervenantId,
      destinataireType: 'ecole',
      destinataireId: collaboration.ecoleId,
      montantHT: collaboration.montantHT,
      tva,
      montantTTC,
      description: `Collaboration: ${collaboration.titre}`,
      status: 'brouillon',
      dateEcheance: collaboration.dateFin
        ? new Date(new Date(collaboration.dateFin).getTime() + 30 * 24 * 60 * 60 * 1000) // +30 jours après fin
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 jours par défaut
      collaborationId: collaboration.id,
    },
  });

  return facture;
}

/**
 * Créer une nouvelle collaboration
 */
export async function createCollaboration(data, userId, userRole) {
  // Déterminer qui crée la collaboration
  let ecoleId = data.ecoleId;
  let intervenantId = data.intervenantId;
  let createdBy;

  if (userRole === 'ECOLE') {
    // L'école crée la collaboration
    const ecole = await prisma.ecole.findUnique({ where: { userId } });
    if (!ecole) {
      const err = new Error('École non trouvée');
      err.status = 404;
      throw err;
    }
    ecoleId = ecole.id;
    createdBy = 'ecole';

    // Vérifier que l'intervenant existe
    const intervenant = await prisma.intervenant.findUnique({ where: { id: intervenantId } });
    if (!intervenant) {
      const err = new Error('Intervenant non trouvé');
      err.status = 404;
      throw err;
    }
  } else if (userRole === 'INTERVENANT') {
    // L'intervenant crée la collaboration
    const intervenant = await prisma.intervenant.findUnique({ where: { userId } });
    if (!intervenant) {
      const err = new Error('Intervenant non trouvé');
      err.status = 404;
      throw err;
    }
    intervenantId = intervenant.id;
    createdBy = 'intervenant';

    // Vérifier que l'école existe
    const ecole = await prisma.ecole.findUnique({ where: { id: ecoleId } });
    if (!ecole) {
      const err = new Error('École non trouvée');
      err.status = 404;
      throw err;
    }
  } else {
    const err = new Error('Rôle non autorisé');
    err.status = 403;
    throw err;
  }

  const collaboration = await prisma.collaboration.create({
    data: {
      ecoleId,
      intervenantId,
      titre: data.titre,
      description: data.description || null,
      dateDebut: data.dateDebut ? new Date(data.dateDebut) : null,
      dateFin: data.dateFin ? new Date(data.dateFin) : null,
      montantHT: data.montantHT || null,
      status: 'brouillon',
      createdBy,
      validatedByEcole: createdBy === 'ecole',
      validatedByIntervenant: createdBy === 'intervenant',
      notes: data.notes || null,
    },
    include: {
      ecole: { select: { id: true, name: true, contactEmail: true } },
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

  return collaboration;
}

/**
 * Récupérer les collaborations de l'utilisateur
 */
export async function getMyCollaborations(userId, userRole, filters = {}) {
  let where = {};

  if (userRole === 'ECOLE') {
    const ecole = await prisma.ecole.findUnique({ where: { userId } });
    if (!ecole) {
      const err = new Error('École non trouvée');
      err.status = 404;
      throw err;
    }
    where.ecoleId = ecole.id;
  } else if (userRole === 'INTERVENANT') {
    const intervenant = await prisma.intervenant.findUnique({ where: { userId } });
    if (!intervenant) {
      const err = new Error('Intervenant non trouvé');
      err.status = 404;
      throw err;
    }
    where.intervenantId = intervenant.id;
  } else {
    const err = new Error('Rôle non autorisé');
    err.status = 403;
    throw err;
  }

  // Filtres optionnels
  if (filters.status) {
    where.status = filters.status;
  }

  const collaborations = await prisma.collaboration.findMany({
    where,
    include: {
      ecole: { select: { id: true, name: true, contactEmail: true } },
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

  return { items: collaborations, total: collaborations.length };
}

/**
 * Récupérer une collaboration par ID
 */
export async function getCollaborationById(id, userId, userRole) {
  const collaboration = await prisma.collaboration.findUnique({
    where: { id },
    include: {
      ecole: { select: { id: true, name: true, contactEmail: true, userId: true } },
      intervenant: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          phone: true,
          city: true,
          userId: true,
          user: { select: { email: true } },
        },
      },
    },
  });

  if (!collaboration) {
    const err = new Error('Collaboration non trouvée');
    err.status = 404;
    throw err;
  }

  // Vérifier que l'utilisateur a accès
  const hasAccess =
    userRole === 'ADMIN' ||
    collaboration.ecole.userId === userId ||
    collaboration.intervenant.userId === userId;

  if (!hasAccess) {
    const err = new Error('Accès non autorisé');
    err.status = 403;
    throw err;
  }

  return collaboration;
}

/**
 * Mettre à jour une collaboration
 */
export async function updateCollaboration(id, data, userId, userRole) {
  const collaboration = await getCollaborationById(id, userId, userRole);

  // Seules les collaborations en brouillon peuvent être modifiées librement
  if (collaboration.status !== 'brouillon' && userRole !== 'ADMIN') {
    const err = new Error('Seules les collaborations en brouillon peuvent être modifiées');
    err.status = 400;
    throw err;
  }

  const updateData = {};

  if (data.titre !== undefined) updateData.titre = data.titre;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.dateDebut !== undefined) updateData.dateDebut = data.dateDebut ? new Date(data.dateDebut) : null;
  if (data.dateFin !== undefined) updateData.dateFin = data.dateFin ? new Date(data.dateFin) : null;
  if (data.montantHT !== undefined) updateData.montantHT = data.montantHT;
  if (data.notes !== undefined) updateData.notes = data.notes;

  const updated = await prisma.collaboration.update({
    where: { id },
    data: updateData,
    include: {
      ecole: { select: { id: true, name: true, contactEmail: true } },
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
 * Valider une collaboration (confirmer la participation)
 */
export async function validateCollaboration(id, userId, userRole) {
  const collaboration = await getCollaborationById(id, userId, userRole);

  const updateData = {};

  if (userRole === 'ECOLE' && collaboration.ecole.userId === userId) {
    updateData.validatedByEcole = true;
  } else if (userRole === 'INTERVENANT' && collaboration.intervenant.userId === userId) {
    updateData.validatedByIntervenant = true;
  } else {
    const err = new Error('Vous ne pouvez pas valider cette collaboration');
    err.status = 403;
    throw err;
  }

  // Si les deux parties valident, passer en "en_cours"
  const willBeValidatedByBoth =
    (updateData.validatedByEcole || collaboration.validatedByEcole) &&
    (updateData.validatedByIntervenant || collaboration.validatedByIntervenant);

  const isBecomingActive = willBeValidatedByBoth && collaboration.status === 'brouillon';

  if (isBecomingActive) {
    updateData.status = 'en_cours';
  }

  const updated = await prisma.collaboration.update({
    where: { id },
    data: updateData,
    include: {
      ecole: { select: { id: true, name: true, contactEmail: true } },
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

  // Si la collaboration vient d'être validée par les deux parties, créer la facture
  if (isBecomingActive) {
    try {
      const facture = await createFactureForCollaboration(updated);
      if (facture) {
        updated.facture = facture;
      }
    } catch (error) {
      console.error('Erreur lors de la création de la facture:', error);
      // On ne bloque pas la validation si la facture échoue
    }
  }

  return updated;
}

/**
 * Changer le statut d'une collaboration
 */
export async function updateCollaborationStatus(id, status, userId, userRole) {
  const collaboration = await getCollaborationById(id, userId, userRole);

  const validStatuses = ['brouillon', 'en_cours', 'terminee', 'annulee'];
  if (!validStatuses.includes(status)) {
    const err = new Error('Statut invalide');
    err.status = 400;
    throw err;
  }

  const updated = await prisma.collaboration.update({
    where: { id },
    data: { status },
    include: {
      ecole: { select: { id: true, name: true, contactEmail: true } },
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
 * Supprimer une collaboration
 */
export async function deleteCollaboration(id, userId, userRole) {
  const collaboration = await getCollaborationById(id, userId, userRole);

  // Seul le créateur ou un admin peut supprimer, et uniquement si brouillon
  const isCreator =
    (collaboration.createdBy === 'ecole' && collaboration.ecole.userId === userId) ||
    (collaboration.createdBy === 'intervenant' && collaboration.intervenant.userId === userId);

  if (!isCreator && userRole !== 'ADMIN') {
    const err = new Error('Seul le créateur peut supprimer cette collaboration');
    err.status = 403;
    throw err;
  }

  if (collaboration.status !== 'brouillon' && userRole !== 'ADMIN') {
    const err = new Error('Seules les collaborations en brouillon peuvent être supprimées');
    err.status = 400;
    throw err;
  }

  await prisma.collaboration.delete({ where: { id } });

  return { success: true };
}

/**
 * Rechercher des écoles (pour les intervenants qui créent une collaboration)
 */
export async function searchEcoles(query) {
  const ecoles = await prisma.ecole.findMany({
    where: {
      name: { contains: query, mode: 'insensitive' },
    },
    select: {
      id: true,
      name: true,
      contactEmail: true,
      address: true,
    },
    take: 10,
  });

  return ecoles;
}

/**
 * Rechercher des intervenants (pour les écoles qui créent une collaboration)
 */
export async function searchIntervenants(query) {
  const intervenants = await prisma.intervenant.findMany({
    where: {
      status: 'approved',
      OR: [
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
        { user: { email: { contains: query, mode: 'insensitive' } } },
      ],
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      profileImage: true,
      city: true,
      user: { select: { email: true } },
    },
    take: 10,
  });

  return intervenants;
}
