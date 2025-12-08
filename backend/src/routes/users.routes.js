/**
 * ============================================
 * Vizion Academy - Routes des Utilisateurs
 * CDC : Gestion des utilisateurs (ADMIN, ECOLE, INTERVENANT)
 * ============================================
 */

import { Router } from "express";
import {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    setUserRole
} from "../controllers/users.controller.js";
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";
import validate from '../middlewares/validate.middleware.js';
import { createUserSchema, updateUserSchema } from '../validators/user.validator.js';
import Joi from 'joi';

const router = Router();

// Schemas de validation
const querySchema = Joi.object({
    take: Joi.number().integer().min(1).max(100).default(50),
    skip: Joi.number().integer().min(0).default(0),
    role: Joi.string().valid('ADMIN', 'ECOLE', 'INTERVENANT').optional(),
    q: Joi.string().max(100).optional()
});

const paramsSchema = Joi.object({ 
    id: Joi.string().uuid().required() 
});

const roleSchema = Joi.object({
    role: Joi.string().valid('ADMIN', 'ECOLE', 'INTERVENANT').required()
});

// Admin only - Liste et création d'utilisateurs
router.get("/", validate({ query: querySchema }), verifyToken, checkRole(['ADMIN']), getUsers);
router.post("/", validate(createUserSchema), verifyToken, checkRole(['ADMIN']), createUser);

// Self OR Admin - Lecture et mise à jour
router.get("/:id", validate({ params: paramsSchema }), verifyToken, getUser);
router.patch("/:id", validate({ params: paramsSchema, body: updateUserSchema }), verifyToken, updateUser);

// Admin only - Suppression et changement de rôle
router.delete("/:id", validate({ params: paramsSchema }), verifyToken, checkRole(['ADMIN']), deleteUser);
router.patch('/:id/role', validate({ params: paramsSchema, body: roleSchema }), verifyToken, checkRole(['ADMIN']), setUserRole);

export default router;
