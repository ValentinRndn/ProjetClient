/**
 * ============================================
 * Vizion Academy - Service des Utilisateurs
 * CDC : Gestion des utilisateurs (ADMIN, ECOLE, INTERVENANT)
 * ============================================
 */

import prisma from '../../prisma.js';
import bcrypt from 'bcrypt';

const BCRYPT_ROUNDS = 12;

/**
 * findAll - Liste tous les utilisateurs avec filtres
 */
export async function findAll(options = {}) {
    const { take = 50, skip = 0, q, role } = options;
    
    const where = {};
    if (role) where.role = role;
    if (q) {
        where.email = { contains: q, mode: 'insensitive' };
    }

    return prisma.user.findMany({
        where,
        take,
        skip,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            ecole: {
                select: { id: true, name: true }
            },
            intervenant: {
                select: { id: true, status: true }
            }
        }
    });
}

/**
 * findById - Trouve un utilisateur par son ID
 */
export async function findById(id) {
    return prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            ecole: {
                select: { id: true, name: true, contactEmail: true, address: true, phone: true }
            },
            intervenant: {
                select: { id: true, bio: true, siret: true, disponibility: true, status: true }
            }
        }
    });
}

/**
 * findByEmail - Trouve un utilisateur par email
 */
export async function findByEmail(email) {
    return prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true
        }
    });
}

/**
 * create - Crée un nouvel utilisateur (ADMIN only)
 */
export async function create(data) {
    // Vérifier si l'email existe déjà
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
        const err = new Error('Cet email est déjà utilisé.');
        err.status = 409;
        throw err;
    }

    const hashedPassword = await bcrypt.hash(data.password, BCRYPT_ROUNDS);

    const userData = {
        email: data.email,
        password: hashedPassword,
        role: data.role || 'INTERVENANT'
    };

    // Créer avec transaction si données d'entité liée
    const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({ data: userData });

        if (data.role === 'ECOLE' && data.ecoleData) {
            await tx.ecole.create({
                data: {
                    name: data.ecoleData.name,
                    contactEmail: data.ecoleData.contactEmail || data.email,
                    address: data.ecoleData.address,
                    phone: data.ecoleData.phone,
                    userId: user.id
                }
            });
        } else if (data.role === 'INTERVENANT') {
            await tx.intervenant.create({
                data: {
                    userId: user.id,
                    bio: data.intervenantData?.bio,
                    siret: data.intervenantData?.siret,
                    disponibility: data.intervenantData?.disponibility,
                    status: 'pending'
                }
            });
        }

        return user;
    });

    return {
        id: result.id,
        email: result.email,
        role: result.role
    };
}

/**
 * update - Met à jour un utilisateur
 */
export async function update(id, payload) {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return null;

    const data = {};
    if (payload.email) data.email = payload.email;
    if (payload.password) {
        data.password = await bcrypt.hash(payload.password, BCRYPT_ROUNDS);
    }

    return prisma.user.update({
        where: { id },
        data,
        select: {
            id: true,
            email: true,
            role: true,
            updatedAt: true
        }
    });
}

/**
 * remove - Supprime un utilisateur (cascade sur Ecole/Intervenant)
 */
export async function remove(id) {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return null;

    await prisma.user.delete({ where: { id } });
    return true;
}

/**
 * setRole - Change le rôle d'un utilisateur (ADMIN only)
 */
export async function setRole(userId, role, actor) {
    // Empêcher de changer son propre rôle
    if (actor && actor.id === userId) {
        const err = new Error('Vous ne pouvez pas changer votre propre rôle.');
        err.status = 400;
        throw err;
    }

    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) return null;

    // Valider le rôle
    const validRoles = ['ADMIN', 'ECOLE', 'INTERVENANT'];
    if (!validRoles.includes(role)) {
        const err = new Error('Rôle invalide.');
        err.status = 400;
        throw err;
    }

    return prisma.user.update({
        where: { id: userId },
        data: { role },
        select: { id: true, email: true, role: true }
    });
}
