/**
 * ============================================
 * Vizion Academy - Service d'Authentification
 * CDC Article 5 : JWT + Bcrypt + PostgreSQL
 * ============================================
 */

import prisma from '../../prisma.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const ACCESS_EXPIRES_IN = process.env.ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN || '7d';
const BCRYPT_ROUNDS = 12;

/**
 * Crée un access token JWT
 */
function signAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
}

/**
 * Crée un refresh token JWT
 */
function signRefreshToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
}

/**
 * Register : Inscription d'un nouvel utilisateur avec hachage bcrypt (CDC Article 5)
 * @param {Object} data - Données d'inscription
 * @returns {Object} { user, accessToken, refreshToken, expiresIn }
 */
export async function register(data) {
  const { email, password, role, name, ecoleData, intervenantData } = data;

  // Vérifier si l'email existe déjà
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    const err = new Error('Email already exists');
    err.status = 409;
    throw err;
  }

  // Hacher le mot de passe avec bcrypt (CDC Article 5)
  const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

  // Créer l'utilisateur avec transaction pour cohérence
  const result = await prisma.$transaction(async (tx) => {
    // Créer l'utilisateur
    const user = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });

    // Créer l'entité liée selon le rôle
    if (role === 'ECOLE') {
      await tx.ecole.create({
        data: {
          name: ecoleData.name,
          contactEmail: ecoleData.contactEmail || email,
          address: ecoleData.address,
          phone: ecoleData.phone,
          userId: user.id,
        },
      });
    } else if (role === 'INTERVENANT') {
      await tx.intervenant.create({
        data: {
          userId: user.id,
          bio: intervenantData?.bio,
          siret: intervenantData?.siret,
          disponibility: intervenantData?.disponibility,
          status: 'pending',
        },
      });
    }

    return user;
  });

  // Générer les tokens
  const payload = { sub: result.id, email: result.email, role: result.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // Sauvegarder le refresh token
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: result.id,
      expiresAt,
    },
  });

  return {
    user: {
      id: result.id,
      email: result.email,
      role: result.role,
    },
    accessToken,
    refreshToken,
    expiresIn: ACCESS_EXPIRES_IN,
  };
}

/**
 * Login : Vérifie le mot de passe et renvoie tokens (CDC Article 5)
 */
export async function login(email, password) {
  const user = await prisma.user.findUnique({ 
    where: { email },
    include: {
      ecole: true,
      intervenant: true,
    }
  });

  if (!user) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const payload = { sub: user.id, email: user.email, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt,
    },
  });

  return { 
    accessToken, 
    refreshToken, 
    expiresIn: ACCESS_EXPIRES_IN,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      ecole: user.ecole,
      intervenant: user.intervenant,
    }
  };
}

/**
 * Refresh : Vérifie le refresh token et retourne un nouvel access token
 */
export async function refresh(oldRefreshToken) {
  const stored = await prisma.refreshToken.findUnique({
    where: { token: oldRefreshToken },
  });

  if (!stored) {
    const err = new Error('Invalid refresh token');
    err.status = 401;
    throw err;
  }

  // Vérifier l'expiration
  if (stored.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { token: oldRefreshToken } });
    const err = new Error('Refresh token expired');
    err.status = 401;
    throw err;
  }

  let decoded;
  try {
    decoded = jwt.verify(oldRefreshToken, JWT_SECRET);
  } catch {
    await prisma.refreshToken.delete({ where: { token: oldRefreshToken } });
    const err = new Error('Invalid refresh token');
    err.status = 401;
    throw err;
  }

  const payload = { sub: decoded.sub, email: decoded.email, role: decoded.role };

  // Rotation : supprime l'ancien token et crée un nouveau
  await prisma.refreshToken.delete({ where: { token: oldRefreshToken } });
  const newRefreshToken = signRefreshToken(payload);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: decoded.sub,
      expiresAt,
    },
  });

  const accessToken = signAccessToken(payload);
  return { accessToken, refreshToken: newRefreshToken, expiresIn: ACCESS_EXPIRES_IN };
}

/**
 * Logout : Invalide un refresh token ou tous les tokens d'un utilisateur
 */
export async function logout(refreshToken, user) {
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    return;
  }

  if (user?.id) {
    await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
  }
}

/**
 * GetUserProfile : Récupère le profil complet de l'utilisateur
 */
export async function getUserProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      ecole: {
        select: {
          id: true,
          name: true,
          contactEmail: true,
          address: true,
          phone: true,
        }
      },
      intervenant: {
        select: {
          id: true,
          bio: true,
          siret: true,
          disponibility: true,
          status: true,
        }
      }
    }
  });

  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  return user;
}
