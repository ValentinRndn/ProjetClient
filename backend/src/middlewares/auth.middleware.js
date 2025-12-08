/**
 * ============================================
 * Vizion Academy - Middleware d'Authentification
 * CDC Article 4, 5 : Authentification JWT et Rôles
 * ============================================
 */

import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

/**
 * verifyToken - Vérifie le JWT et décode l'utilisateur (CDC Article 5)
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 * @param {NextFunction} next - Fonction next
 */
export function verifyToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            logger.warn('Authentication failed: No authorization header', { 
                ip: req.ip, 
                path: req.path 
            });
            return res.status(401).json({ 
                success: false, 
                message: 'Accès non autorisé. Token manquant.' 
            });
        }

        // Format attendu: "Bearer <token>"
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            logger.warn('Authentication failed: Invalid token format', { 
                ip: req.ip, 
                path: req.path 
            });
            return res.status(401).json({ 
                success: false, 
                message: 'Format de token invalide. Utilisez "Bearer <token>".' 
            });
        }

        const token = parts[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Ajouter les infos utilisateur décodées à la requête
        req.user = {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role
        };

        logger.info('Token verified successfully', { 
            userId: req.user.id, 
            role: req.user.role,
            path: req.path 
        });

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            logger.warn('Authentication failed: Token expired', { 
                ip: req.ip, 
                path: req.path 
            });
            return res.status(401).json({ 
                success: false, 
                message: 'Token expiré. Veuillez vous reconnecter.' 
            });
        }

        if (error.name === 'JsonWebTokenError') {
            logger.warn('Authentication failed: Invalid token', { 
                ip: req.ip, 
                path: req.path,
                error: error.message 
            });
            return res.status(401).json({ 
                success: false, 
                message: 'Token invalide.' 
            });
        }

        logger.error('Authentication error', { 
            ip: req.ip, 
            path: req.path,
            error: error.message 
        });
        return res.status(500).json({ 
            success: false, 
            message: 'Erreur d\'authentification.' 
        });
    }
}

/**
 * checkRole - Middleware pour autoriser l'accès uniquement aux rôles spécifiés (CDC Article 4, 5)
 * @param {string[]} allowedRoles - Liste des rôles autorisés (ADMIN, ECOLE, INTERVENANT)
 * @returns {Function} Middleware Express
 */
export function checkRole(allowedRoles) {
    return (req, res, next) => {
        // Vérifier que l'utilisateur est authentifié
        if (!req.user) {
            logger.warn('Role check failed: User not authenticated', { 
                ip: req.ip, 
                path: req.path 
            });
            return res.status(401).json({ 
                success: false, 
                message: 'Authentification requise.' 
            });
        }

        const userRole = req.user.role;

        // Vérifier si le rôle de l'utilisateur est autorisé
        if (!allowedRoles.includes(userRole)) {
            logger.warn('Role check failed: Insufficient permissions', { 
                userId: req.user.id,
                userRole: userRole,
                requiredRoles: allowedRoles,
                path: req.path 
            });
            return res.status(403).json({ 
                success: false, 
                message: 'Accès interdit. Permissions insuffisantes.' 
            });
        }

        logger.info('Role check passed', { 
            userId: req.user.id,
            userRole: userRole,
            path: req.path 
        });

        next();
    };
}

/**
 * isAdmin - Raccourci pour vérifier le rôle ADMIN
 */
export const isAdmin = checkRole(['ADMIN']);

/**
 * isEcole - Raccourci pour vérifier le rôle ECOLE
 */
export const isEcole = checkRole(['ECOLE']);

/**
 * isIntervenant - Raccourci pour vérifier le rôle INTERVENANT
 */
export const isIntervenant = checkRole(['INTERVENANT']);

/**
 * isEcoleOrAdmin - Raccourci pour vérifier ECOLE ou ADMIN
 */
export const isEcoleOrAdmin = checkRole(['ECOLE', 'ADMIN']);

/**
 * isIntervenantOrAdmin - Raccourci pour vérifier INTERVENANT ou ADMIN
 */
export const isIntervenantOrAdmin = checkRole(['INTERVENANT', 'ADMIN']);

// Export par défaut pour compatibilité avec l'ancien code
export default verifyToken;