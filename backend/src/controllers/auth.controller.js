/**
 * ============================================
 * Vizion Academy - Contrôleur d'Authentification
 * CDC Article 5 : JWT + Bcrypt
 * ============================================
 */

import * as authService from '../services/auth.service.js';
import logger from '../utils/logger.js';

/**
 * POST /auth/register
 * Inscription d'un nouvel utilisateur avec hachage du mot de passe (CDC Article 5)
 * Body: { email, password, role, name?, ecoleData?, intervenantData? }
 */
export async function register(req, res, next) {
    try {
        const { email, password, role, name, ecoleData, intervenantData } = req.body;
        logger.info('Registration attempt', { email, role });

        // Validation des champs obligatoires
        if (!email || !password || !role) {
            logger.warn('Registration failed: missing required fields', { email });
            return res.status(400).json({ 
                success: false, 
                message: 'Email, mot de passe et rôle sont requis.' 
            });
        }

        // Validation du rôle
        const validRoles = ['ADMIN', 'ECOLE', 'INTERVENANT'];
        if (!validRoles.includes(role)) {
            logger.warn('Registration failed: invalid role', { email, role });
            return res.status(400).json({ 
                success: false, 
                message: 'Rôle invalide. Rôles acceptés: ADMIN, ECOLE, INTERVENANT.' 
            });
        }

        // Validation des données spécifiques au rôle
        if (role === 'ECOLE' && (!ecoleData || !ecoleData.name)) {
            logger.warn('Registration failed: missing ecole name', { email });
            return res.status(400).json({ 
                success: false, 
                message: 'Le nom de l\'école est requis pour le rôle ECOLE.' 
            });
        }

        const result = await authService.register({
            email,
            password,
            role,
            name,
            ecoleData,
            intervenantData
        });

        logger.info('Registration successful', { email, userId: result.user.id, role });
        return res.status(201).json({ 
            success: true, 
            message: 'Inscription réussie.',
            ...result 
        });
    } catch (err) {
        logger.error('Registration error', { email: req.body.email, error: err.message });
        
        if (err.message === 'Email already exists') {
            return res.status(409).json({ 
                success: false, 
                message: 'Cet email est déjà utilisé.' 
            });
        }
        
        next(err);
    }
}

/**
 * POST /auth/login
 * Connexion et émission du JWT (CDC Article 5)
 */
export async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        logger.info('Login attempt', { email });
        
        if (!email || !password) {
            logger.warn('Login failed: missing credentials', { email });
            return res.status(400).json({ 
                success: false, 
                message: 'Email et mot de passe requis.' 
            });
        }

        const tokens = await authService.login(email, password);
        logger.info('Login successful', { email });
        
        return res.status(200).json({ 
            success: true, 
            message: 'Connexion réussie.',
            ...tokens 
        });
    } catch (err) {
        logger.error('Login error', { email: req.body.email, error: err.message });
        
        if (err.status === 401) {
            return res.status(401).json({ 
                success: false, 
                message: 'Identifiants invalides.' 
            });
        }
        
        next(err);
    }
}

/**
 * POST /auth/refresh
 * Rafraîchissement du token d'accès
 */
export async function refreshToken(req, res, next) {
    try {
        const { refreshToken } = req.body;
        logger.info('Token refresh attempt');
        
        if (!refreshToken) {
            logger.warn('Token refresh failed: missing refreshToken');
            return res.status(400).json({ 
                success: false, 
                message: 'refreshToken requis.' 
            });
        }

        const tokens = await authService.refresh(refreshToken);
        logger.info('Token refresh successful');
        return res.status(200).json({ success: true, ...tokens });
    } catch (err) {
        logger.error('Token refresh error', { error: err.message });
        
        if (err.status === 401) {
            return res.status(401).json({ 
                success: false, 
                message: 'Refresh token invalide ou expiré.' 
            });
        }
        
        next(err);
    }
}

/**
 * POST /auth/logout
 * Déconnexion et invalidation du refresh token
 */
export async function logout(req, res, next) {
    try {
        logger.info('Logout attempt', { userId: req.user?.id });
        const { refreshToken } = req.body;
        await authService.logout(refreshToken, req.user);
        logger.info('Logout successful', { userId: req.user?.id });
        return res.status(200).json({ 
            success: true, 
            message: 'Déconnexion réussie.' 
        });
    } catch (err) {
        logger.error('Logout error', { userId: req.user?.id, error: err.message });
        next(err);
    }
}

/**
 * GET /auth/me
 * Récupérer le profil de l'utilisateur connecté
 */
export async function me(req, res, next) {
    try {
        logger.info('Get user profile', { userId: req.user?.id });
        
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Non authentifié.' 
            });
        }

        const userProfile = await authService.getUserProfile(req.user.id);
        return res.status(200).json({ 
            success: true, 
            user: userProfile 
        });
    } catch (err) {
        logger.error('Get user profile error', { userId: req.user?.id, error: err.message });
        next(err);
    }
}