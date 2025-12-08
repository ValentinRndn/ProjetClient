/**
 * ============================================
 * Vizion Academy - Contrôleur des Utilisateurs
 * CDC : Gestion des utilisateurs (ADMIN, ECOLE, INTERVENANT)
 * ============================================
 */

import * as usersService from "../services/users.service.js";
import logger from "../utils/logger.js";

/**
 * GET /api/v1/users
 * Lister tous les utilisateurs (ADMIN only)
 */
export async function getUsers(req, res, next) {
    try {
        const { take, skip, q, role } = req.query;
        logger.info('Get users list', { take, skip, q, role, adminId: req.user?.id });

        const data = await usersService.findAll({
            take: take ? parseInt(take) : 50,
            skip: skip ? parseInt(skip) : 0,
            q: q || null,
            role: role || null
        });

        logger.info('Users list retrieved', { count: data.length });
        res.json({ success: true, data });
    } catch (err) {
        logger.error('Get users list error', { error: err.message });
        next(err);
    }
}

/**
 * GET /api/v1/users/:id
 * Récupérer un utilisateur par son ID (Self OR Admin)
 */
export async function getUser(req, res, next) {
    try {
        const { id } = req.params;
        logger.info('Get user by ID', { targetUserId: id, requesterId: req.user?.id });

        // Self OR Admin
        if (req.user.id !== id && req.user.role !== "ADMIN") {
            logger.warn('Get user forbidden', { targetUserId: id, requesterId: req.user?.id });
            return res.status(403).json({ success: false, message: "Accès interdit." });
        }

        const user = await usersService.findById(id);
        if (!user) {
            logger.warn('User not found', { targetUserId: id });
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé." });
        }

        logger.info('User retrieved', { targetUserId: id });
        res.json({ success: true, data: user });
    } catch (err) {
        logger.error('Get user error', { targetUserId: req.params.id, error: err.message });
        next(err);
    }
}

/**
 * POST /api/v1/users
 * Créer un utilisateur (ADMIN only)
 */
export async function createUser(req, res, next) {
    try {
        logger.info('Create user attempt', { email: req.body.email, role: req.body.role, adminId: req.user?.id });
        const user = await usersService.create(req.body);
        logger.info('User created successfully', { userId: user.id, email: user.email });
        res.status(201).json({ success: true, data: user });
    } catch (err) {
        logger.error('Create user error', { email: req.body.email, error: err.message });
        
        if (err.status === 409) {
            return res.status(409).json({ success: false, message: err.message });
        }
        next(err);
    }
}

/**
 * PATCH /api/v1/users/:id
 * Mettre à jour un utilisateur (Self OR Admin)
 */
export async function updateUser(req, res, next) {
    try {
        const { id } = req.params;
        logger.info('Update user attempt', { targetUserId: id, requesterId: req.user?.id });

        // Self OR Admin
        if (req.user.id !== id && req.user.role !== "ADMIN") {
            logger.warn('Update user forbidden', { targetUserId: id, requesterId: req.user?.id });
            return res.status(403).json({ success: false, message: "Accès interdit." });
        }

        const updated = await usersService.update(id, req.body);
        if (!updated) {
            logger.warn('Update user failed: user not found', { targetUserId: id });
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé." });
        }

        logger.info('User updated successfully', { targetUserId: id });
        res.json({ success: true, data: updated });
    } catch (err) {
        logger.error('Update user error', { targetUserId: req.params.id, error: err.message });
        next(err);
    }
}

/**
 * DELETE /api/v1/users/:id
 * Supprimer un utilisateur (ADMIN only)
 */
export async function deleteUser(req, res, next) {
    try {
        const { id } = req.params;
        logger.info('Delete user attempt', { targetUserId: id, adminId: req.user?.id });

        const deleted = await usersService.remove(id);
        if (!deleted) {
            logger.warn('Delete user failed: user not found', { targetUserId: id });
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé." });
        }

        logger.info('User deleted successfully', { targetUserId: id });
        res.json({ success: true, message: "Utilisateur supprimé." });
    } catch (err) {
        logger.error('Delete user error', { targetUserId: req.params.id, error: err.message });
        next(err);
    }
}

/**
 * PATCH /api/v1/users/:id/role
 * Changer le rôle d'un utilisateur (ADMIN only)
 */
export async function setUserRole(req, res, next) {
    try {
        const { id } = req.params;
        const { role } = req.body;
        logger.info('Set user role attempt', { targetUserId: id, newRole: role, adminId: req.user?.id });

        const updated = await usersService.setRole(id, role, req.user);
        if (!updated) {
            logger.warn('Set user role failed: user not found', { targetUserId: id });
            return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
        }

        logger.info('User role updated successfully', { targetUserId: id, newRole: role });
        res.json({ success: true, data: updated });
    } catch (err) {
        logger.error('Set user role error', { targetUserId: req.params.id, newRole: req.body.role, error: err.message });
        
        if (err.status === 400) {
            return res.status(400).json({ success: false, message: err.message });
        }
        next(err);
    }
}
