/**
 * ============================================
 * Vizion Academy - Service des Intervenants
 * CDC : Gestion des intervenants et documents
 * ============================================
 */

import prisma from "../../prisma.js";
import { notifyIntervenantApproved, notifyIntervenantRejected } from "./email.service.js";

/**
 * findAll - Liste tous les intervenants
 */
export async function findAll(options = {}) {
  const { take = 100, skip = 0, status } = options;
  const where = status ? { status } : {};

  return prisma.intervenant.findMany({
    where,
    take,
    skip,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      bio: true,
      siret: true,
      firstName: true,
      lastName: true,
      profileImage: true,
      disponibility: true,
      status: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
      // Champs profil enrichi
      phone: true,
      city: true,
      yearsExperience: true,
      expertises: true,
      videoUrl: true,
      linkedinUrl: true,
      website: true,
      // Nouveaux champs profil enrichi
      diplomas: true,
      availabilityModes: true,
      availabilityLocation: true,
      experiences: true,
      softwares: true,
      languages: true,
      user: {
        select: { id: true, email: true, role: true },
      },
      documents: true,
      missions: {
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
        },
      },
    },
  });
}

/**
 * findById - Trouve un intervenant par son ID
 */
export async function findById(id) {
  return prisma.intervenant.findUnique({
    where: { id },
    select: {
      id: true,
      bio: true,
      siret: true,
      firstName: true,
      lastName: true,
      profileImage: true,
      disponibility: true,
      status: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
      // Champs profil enrichi
      phone: true,
      city: true,
      yearsExperience: true,
      expertises: true,
      videoUrl: true,
      linkedinUrl: true,
      website: true,
      // Nouveaux champs profil enrichi
      diplomas: true,
      availabilityModes: true,
      availabilityLocation: true,
      experiences: true,
      softwares: true,
      languages: true,
      user: {
        select: { id: true, email: true, role: true },
      },
      documents: true,
      missions: {
        take: 10,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          ecole: { select: { id: true, name: true } },
        },
      },
    },
  });
}

/**
 * findByUserId - Trouve un intervenant par son userId
 */
export async function findByUserId(userId) {
  return prisma.intervenant.findUnique({
    where: { userId },
    include: {
      user: { select: { id: true, email: true, role: true } },
      documents: true,
      missions: {
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          ecole: { select: { id: true, name: true } },
        },
      },
    },
  });
}

/**
 * update - Met à jour un intervenant (tous les champs du profil)
 */
export async function update(id, payload) {
  const existing = await prisma.intervenant.findUnique({ where: { id } });
  if (!existing) return null;

  // Construire l'objet de mise à jour avec tous les champs possibles
  const updateData = {};

  // Informations personnelles
  if (payload.firstName !== undefined) updateData.firstName = payload.firstName;
  if (payload.lastName !== undefined) updateData.lastName = payload.lastName;
  if (payload.bio !== undefined) updateData.bio = payload.bio;
  if (payload.phone !== undefined) updateData.phone = payload.phone;
  if (payload.city !== undefined) updateData.city = payload.city;

  // Informations professionnelles
  if (payload.siret !== undefined) updateData.siret = payload.siret;
  if (payload.yearsExperience !== undefined) updateData.yearsExperience = payload.yearsExperience;
  if (payload.expertises !== undefined) updateData.expertises = payload.expertises;

  // Liens et médias
  if (payload.videoUrl !== undefined) updateData.videoUrl = payload.videoUrl;
  if (payload.linkedinUrl !== undefined) updateData.linkedinUrl = payload.linkedinUrl;
  if (payload.website !== undefined) updateData.website = payload.website;
  if (payload.profileImage !== undefined) updateData.profileImage = payload.profileImage;

  // Disponibilités et statut
  if (payload.disponibility !== undefined) updateData.disponibility = payload.disponibility;
  if (payload.status !== undefined) updateData.status = payload.status;

  // Nouveaux champs profil enrichi
  if (payload.diplomas !== undefined) updateData.diplomas = payload.diplomas;
  if (payload.availabilityModes !== undefined) updateData.availabilityModes = payload.availabilityModes;
  if (payload.availabilityLocation !== undefined) updateData.availabilityLocation = payload.availabilityLocation;
  if (payload.experiences !== undefined) updateData.experiences = payload.experiences;
  if (payload.softwares !== undefined) updateData.softwares = payload.softwares;
  if (payload.languages !== undefined) updateData.languages = payload.languages;

  return prisma.intervenant.update({
    where: { id },
    data: updateData,
    include: {
      user: { select: { id: true, email: true, role: true } },
      documents: true,
    },
  });
}

/**
 * updateStatus - Change le statut d'un intervenant (pending, approved, rejected)
 */
export async function updateStatus(id, status, reason = null) {
  const existing = await prisma.intervenant.findUnique({
    where: { id },
    include: { user: { select: { id: true, email: true } } },
  });
  if (!existing) return null;

  const updated = await prisma.intervenant.update({
    where: { id },
    data: { status },
    include: {
      user: { select: { id: true, email: true, role: true } },
    },
  });

  // Envoyer les notifications selon le nouveau statut
  const intervenantName = [existing.firstName, existing.lastName]
    .filter(Boolean)
    .join(' ') || 'Intervenant';

  if (status === 'approved' && existing.status !== 'approved') {
    // Notifier l'intervenant que son profil a été validé
    notifyIntervenantApproved(existing.user.id, intervenantName)
      .catch(err => console.error('Failed to send approval notification:', err));
  } else if (status === 'rejected' && existing.status !== 'rejected') {
    // Notifier l'intervenant que sa demande a été rejetée
    notifyIntervenantRejected(existing.user.id, intervenantName, reason)
      .catch(err => console.error('Failed to send rejection notification:', err));
  }

  return updated;
}

/**
 * addDocument - Ajoute un document à un intervenant
 * Avec support du chiffrement pour les pièces sensibles
 */
export async function addDocument(intervenantId, doc) {
  const interv = await prisma.intervenant.findUnique({
    where: { id: intervenantId },
  });
  if (!interv) {
    const err = new Error("Intervenant non trouvé.");
    err.status = 404;
    throw err;
  }

  return prisma.document.create({
    data: {
      intervenantId,
      fileName: doc.fileName,
      filePath: doc.filePath || doc.s3Key || "",
      type: doc.type,
      // Champs de chiffrement (si fournis)
      isEncrypted: doc.isEncrypted || false,
      encryptionIV: doc.encryptionIV || null,
      checksum: doc.checksum || null,
    },
  });
}

/**
 * getDocument - Récupère un document spécifique
 */
export async function getDocument(intervenantId, documentId) {
  return prisma.document.findFirst({
    where: {
      id: documentId,
      intervenantId,
    },
  });
}

/**
 * getDocuments - Liste les documents d'un intervenant
 */
export async function getDocuments(intervenantId) {
  return prisma.document.findMany({
    where: { intervenantId },
    orderBy: { uploadedAt: "desc" },
  });
}

/**
 * deleteDocument - Supprime un document
 */
export async function deleteDocument(intervenantId, documentId) {
  const doc = await prisma.document.findFirst({
    where: { id: documentId, intervenantId },
  });

  if (!doc) {
    const err = new Error("Document non trouvé.");
    err.status = 404;
    throw err;
  }

  return prisma.document.delete({ where: { id: documentId } });
}

/**
 * deleteIntervenant - Supprime un intervenant et toutes ses données associées
 */
export async function deleteIntervenant(id) {
  const existing = await prisma.intervenant.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!existing) {
    const err = new Error("Intervenant non trouvé.");
    err.status = 404;
    throw err;
  }

  // Supprimer les documents associés
  await prisma.document.deleteMany({ where: { intervenantId: id } });

  // Supprimer l'intervenant
  await prisma.intervenant.delete({ where: { id } });

  // Supprimer l'utilisateur associé si présent
  if (existing.userId) {
    await prisma.user.delete({ where: { id: existing.userId } });
  }

  return existing;
}
