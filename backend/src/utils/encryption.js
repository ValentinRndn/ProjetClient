/**
 * ============================================
 * Vizion Academy - Utilitaire de chiffrement
 * Chiffrement AES-256-GCM pour pièces sensibles
 * ============================================
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import logger from './logger.js';

// Clé de chiffrement depuis les variables d'environnement
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');

// Types de documents sensibles qui doivent être chiffrés
const SENSITIVE_DOCUMENT_TYPES = [
  'RIB',
  'PIECE_IDENTITE',
  'CASIER_JUDICIAIRE',
  'ATTESTATION_FISCALE',
];

/**
 * Vérifie si un type de document est sensible et doit être chiffré
 */
export function isSensitiveDocumentType(type) {
  return SENSITIVE_DOCUMENT_TYPES.includes(type);
}

/**
 * Génère un hash SHA-256 d'un buffer
 */
export function generateChecksum(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * Chiffre un buffer avec AES-256-GCM
 * @param {Buffer} buffer - Les données à chiffrer
 * @returns {{ encrypted: Buffer, iv: string, authTag: string }}
 */
export function encryptBuffer(buffer) {
  try {
    // Générer un vecteur d'initialisation aléatoire
    const iv = crypto.randomBytes(16);

    // Créer le cipher avec AES-256-GCM
    const key = Buffer.from(ENCRYPTION_KEY, 'hex');
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    // Chiffrer les données
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);

    // Récupérer le tag d'authentification
    const authTag = cipher.getAuthTag();

    // Retourner les données chiffrées avec IV et authTag
    // Format: IV (16 bytes) + authTag (16 bytes) + encrypted data
    const result = Buffer.concat([iv, authTag, encrypted]);

    logger.info('Buffer encrypted successfully', {
      originalSize: buffer.length,
      encryptedSize: result.length
    });

    return {
      encrypted: result,
      iv: iv.toString('hex'),
      checksum: generateChecksum(buffer),
    };
  } catch (error) {
    logger.error('Encryption error', { error: error.message });
    throw new Error('Erreur lors du chiffrement du fichier');
  }
}

/**
 * Déchiffre un buffer chiffré avec AES-256-GCM
 * @param {Buffer} encryptedBuffer - Les données chiffrées (IV + authTag + data)
 * @returns {Buffer} - Les données déchiffrées
 */
export function decryptBuffer(encryptedBuffer) {
  try {
    // Extraire IV, authTag et données chiffrées
    const iv = encryptedBuffer.subarray(0, 16);
    const authTag = encryptedBuffer.subarray(16, 32);
    const encrypted = encryptedBuffer.subarray(32);

    // Créer le decipher
    const key = Buffer.from(ENCRYPTION_KEY, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    // Déchiffrer
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

    logger.info('Buffer decrypted successfully', {
      encryptedSize: encryptedBuffer.length,
      decryptedSize: decrypted.length
    });

    return decrypted;
  } catch (error) {
    logger.error('Decryption error', { error: error.message });
    throw new Error('Erreur lors du déchiffrement du fichier');
  }
}

/**
 * Chiffre un fichier sur le disque
 * @param {string} filePath - Chemin du fichier à chiffrer
 * @returns {Promise<{ iv: string, checksum: string }>}
 */
export async function encryptFile(filePath) {
  const absolutePath = path.resolve(process.cwd(), filePath);

  // Lire le fichier
  const fileBuffer = fs.readFileSync(absolutePath);

  // Chiffrer
  const { encrypted, iv, checksum } = encryptBuffer(fileBuffer);

  // Sauvegarder le fichier chiffré (même chemin avec extension .enc)
  const encryptedPath = absolutePath + '.enc';
  fs.writeFileSync(encryptedPath, encrypted);

  // Supprimer le fichier original
  fs.unlinkSync(absolutePath);

  // Renommer le fichier chiffré
  fs.renameSync(encryptedPath, absolutePath);

  logger.info('File encrypted and saved', {
    filePath,
    checksum: checksum.substring(0, 16) + '...'
  });

  return { iv, checksum };
}

/**
 * Déchiffre un fichier et retourne le buffer
 * @param {string} filePath - Chemin du fichier chiffré
 * @returns {Buffer} - Données déchiffrées
 */
export function decryptFile(filePath) {
  const absolutePath = path.resolve(process.cwd(), filePath);

  // Lire le fichier chiffré
  const encryptedBuffer = fs.readFileSync(absolutePath);

  // Déchiffrer
  return decryptBuffer(encryptedBuffer);
}

/**
 * Vérifie l'intégrité d'un fichier déchiffré avec son checksum
 * @param {Buffer} buffer - Le buffer déchiffré
 * @param {string} expectedChecksum - Le checksum attendu
 * @returns {boolean}
 */
export function verifyChecksum(buffer, expectedChecksum) {
  const actualChecksum = generateChecksum(buffer);
  return actualChecksum === expectedChecksum;
}

export default {
  isSensitiveDocumentType,
  encryptBuffer,
  decryptBuffer,
  encryptFile,
  decryptFile,
  generateChecksum,
  verifyChecksum,
  SENSITIVE_DOCUMENT_TYPES,
};
