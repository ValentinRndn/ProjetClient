/**
 * ============================================
 * Vizion Academy - Service des Intervenants
 * CDC : Gestion des intervenants et documents
 * ============================================
 */

import prisma from "../../prisma.js";

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
 * update - Met à jour un intervenant
 */
export async function update(id, payload) {
  const existing = await prisma.intervenant.findUnique({ where: { id } });
  if (!existing) return null;

  return prisma.intervenant.update({
    where: { id },
    data: {
      bio: payload.bio ?? existing.bio,
      siret: payload.siret ?? existing.siret,
      disponibility: payload.disponibility ?? existing.disponibility,
      status: payload.status ?? existing.status,
    },
    include: {
      user: { select: { id: true, email: true, role: true } },
      documents: true,
    },
  });
}

/**
 * updateStatus - Change le statut d'un intervenant (pending, approved, rejected)
 */
export async function updateStatus(id, status) {
  const existing = await prisma.intervenant.findUnique({ where: { id } });
  if (!existing) return null;

  return prisma.intervenant.update({
    where: { id },
    data: { status },
    include: {
      user: { select: { id: true, email: true, role: true } },
    },
  });
}

/**
 * addDocument - Ajoute un document à un intervenant (CDC MVP)
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
      type: doc.type, // CV, RIB, KBIS, etc.
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
