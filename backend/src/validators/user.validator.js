import Joi from 'joi';

// Roles alignés avec le schéma Prisma: ADMIN, ECOLE, INTERVENANT
export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(2).max(100).required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('ADMIN', 'ECOLE', 'INTERVENANT').required()
});

export const updateUserSchema = Joi.object({
  email: Joi.string().email().optional(),
  name: Joi.string().min(2).max(100).optional(),
  password: Joi.string().min(8).optional(),
  role: Joi.string().valid('ADMIN', 'ECOLE', 'INTERVENANT').optional()
});

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  password: Joi.string().min(8).optional(),
  currentPassword: Joi.string().when('password', {
    is: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.optional()
  })
});