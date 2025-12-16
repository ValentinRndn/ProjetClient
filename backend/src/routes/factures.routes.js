/**
 * ============================================
 * Vizion Academy - Routes Facturation
 * Gestion des factures école/intervenant
 * ============================================
 */

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken, checkRole } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import Joi from 'joi';
import path from 'path';
import fs from 'fs';
import logger from '../utils/logger.js';
import { generateFacturePDF, getFacturePDFPath, factureHasPDF } from '../services/pdf.service.js';

const router = Router();
const prisma = new PrismaClient();

// Schemas de validation
const createFactureSchema = Joi.object({
    type: Joi.string().valid('ecole', 'intervenant').required(),
    destinataireId: Joi.string().uuid().required(),
    missionId: Joi.string().uuid().optional(),
    montantHT: Joi.number().integer().min(0).required(),
    tva: Joi.number().integer().min(0).default(0),
    description: Joi.string().max(1000).optional(),
    lignes: Joi.array().items(Joi.object({
        description: Joi.string().required(),
        quantite: Joi.number().required(),
        prixUnitaire: Joi.number().required(),
        total: Joi.number().required(),
    })).optional(),
    notes: Joi.string().max(500).optional(),
    dateEcheance: Joi.date().optional(),
});

const updateFactureSchema = Joi.object({
    status: Joi.string().valid('brouillon', 'envoyee', 'payee', 'annulee', 'en_retard').optional(),
    datePaiement: Joi.date().optional(),
    modePaiement: Joi.string().max(50).optional(),
    reference: Joi.string().max(100).optional(),
    notes: Joi.string().max(500).optional().allow(''),
});

const querySchema = Joi.object({
    type: Joi.string().valid('ecole', 'intervenant').optional(),
    status: Joi.string().valid('brouillon', 'envoyee', 'payee', 'annulee', 'en_retard').optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
});

const paramsSchema = Joi.object({
    id: Joi.string().uuid().required(),
});

// Génération du numéro de facture
async function generateFactureNumero() {
    const year = new Date().getFullYear();
    const count = await prisma.facture.count({
        where: {
            numero: { startsWith: `FAC-${year}` },
        },
    });
    return `FAC-${year}-${String(count + 1).padStart(4, '0')}`;
}

// ============================================
// Routes Factures
// ============================================

/**
 * GET /api/v1/factures
 * Liste les factures (filtrées selon le rôle)
 */
router.get('/', verifyToken, validate({ query: querySchema }), async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const { type, status, startDate, endDate } = req.query;
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;

        // Construire les filtres selon le rôle
        const where = {};

        if (userRole === 'INTERVENANT') {
            // Les intervenants voient leurs factures
            const intervenant = await prisma.intervenant.findUnique({ where: { userId } });
            if (!intervenant) {
                return res.status(404).json({ success: false, message: 'Profil intervenant non trouvé' });
            }
            where.OR = [
                { emetteurType: 'intervenant', emetteurId: intervenant.id },
                { destinataireType: 'intervenant', destinataireId: intervenant.id },
            ];
        } else if (userRole === 'ECOLE') {
            // Les écoles voient leurs factures
            const ecole = await prisma.ecole.findUnique({ where: { userId } });
            if (!ecole) {
                return res.status(404).json({ success: false, message: 'Profil école non trouvé' });
            }
            where.OR = [
                { emetteurType: 'ecole', emetteurId: ecole.id },
                { destinataireType: 'ecole', destinataireId: ecole.id },
            ];
        }
        // ADMIN voit toutes les factures

        if (type) where.type = type;
        if (status) where.status = status;

        if (startDate || endDate) {
            where.dateEmission = {};
            if (startDate) where.dateEmission.gte = new Date(startDate);
            if (endDate) where.dateEmission.lte = new Date(endDate);
        }

        const total = await prisma.facture.count({ where });
        const factures = await prisma.facture.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
            include: {
                mission: {
                    select: { id: true, title: true, status: true },
                },
            },
        });

        // Calcul des totaux
        const totaux = await prisma.facture.aggregate({
            where,
            _sum: {
                montantHT: true,
                montantTTC: true,
            },
        });

        logger.info('Factures retrieved', { userId, count: factures.length });

        res.json({
            success: true,
            data: factures,
            totaux: {
                montantHT: totaux._sum.montantHT || 0,
                montantTTC: totaux._sum.montantTTC || 0,
            },
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        logger.error('Error fetching factures', { userId: req.user?.id, error: error.message });
        next(error);
    }
});

/**
 * GET /api/v1/factures/:id
 * Récupérer une facture par ID
 */
router.get('/:id', validate({ params: paramsSchema }), verifyToken, async (req, res, next) => {
    try {
        const { id } = req.params;

        const facture = await prisma.facture.findUnique({
            where: { id },
            include: {
                mission: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        ecole: { select: { id: true, name: true } },
                        intervenant: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                user: { select: { email: true } },
                            },
                        },
                    },
                },
            },
        });

        if (!facture) {
            return res.status(404).json({ success: false, message: 'Facture non trouvée' });
        }

        res.json({ success: true, data: facture });
    } catch (error) {
        logger.error('Error fetching facture', { error: error.message });
        next(error);
    }
});

/**
 * POST /api/v1/factures
 * Créer une nouvelle facture
 */
router.post('/', validate({ body: createFactureSchema }), verifyToken, checkRole(['ADMIN', 'ECOLE', 'INTERVENANT']), async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const { type, destinataireId, missionId, montantHT, tva, description, lignes, notes, dateEcheance } = req.body;

        // Déterminer l'émetteur
        let emetteurType, emetteurId;

        if (userRole === 'ADMIN') {
            emetteurType = 'plateforme';
            emetteurId = null;
        } else if (userRole === 'INTERVENANT') {
            const intervenant = await prisma.intervenant.findUnique({ where: { userId } });
            if (!intervenant) {
                return res.status(404).json({ success: false, message: 'Profil intervenant non trouvé' });
            }
            emetteurType = 'intervenant';
            emetteurId = intervenant.id;
        } else if (userRole === 'ECOLE') {
            const ecole = await prisma.ecole.findUnique({ where: { userId } });
            if (!ecole) {
                return res.status(404).json({ success: false, message: 'Profil école non trouvé' });
            }
            emetteurType = 'ecole';
            emetteurId = ecole.id;
        }

        // Calculer le montant TTC
        const montantTTC = montantHT + tva;

        // Générer le numéro de facture
        const numero = await generateFactureNumero();

        // Créer la facture
        const facture = await prisma.facture.create({
            data: {
                numero,
                type,
                emetteurType,
                emetteurId,
                destinataireType: type === 'ecole' ? 'ecole' : 'intervenant',
                destinataireId,
                missionId,
                montantHT,
                tva,
                montantTTC,
                description,
                lignes,
                notes,
                dateEcheance: dateEcheance ? new Date(dateEcheance) : null,
                status: 'brouillon',
            },
        });

        logger.info('Facture created', { factureId: facture.id, numero: facture.numero });

        res.status(201).json({
            success: true,
            message: 'Facture créée avec succès',
            data: facture,
        });
    } catch (error) {
        logger.error('Error creating facture', { error: error.message });
        next(error);
    }
});

/**
 * PATCH /api/v1/factures/:id
 * Mettre à jour une facture
 */
router.patch('/:id', validate({ params: paramsSchema, body: updateFactureSchema }), verifyToken, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, datePaiement, modePaiement, reference, notes } = req.body;

        const existing = await prisma.facture.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Facture non trouvée' });
        }

        const updateData = {};
        if (status !== undefined) {
            updateData.status = status;
            if (status === 'envoyee' && !existing.dateEmission) {
                updateData.dateEmission = new Date();
            }
        }
        if (datePaiement !== undefined) updateData.datePaiement = new Date(datePaiement);
        if (modePaiement !== undefined) updateData.modePaiement = modePaiement;
        if (reference !== undefined) updateData.reference = reference;
        if (notes !== undefined) updateData.notes = notes;

        const facture = await prisma.facture.update({
            where: { id },
            data: updateData,
        });

        // Si la facture est payée et liée à une mission, mettre à jour le statut de paiement de la mission
        if (status === 'payee' && facture.missionId) {
            await prisma.mission.update({
                where: { id: facture.missionId },
                data: {
                    paymentStatus: 'paye',
                    datePaiement: updateData.datePaiement || new Date(),
                },
            });
        }

        logger.info('Facture updated', { factureId: id, status });

        res.json({
            success: true,
            message: 'Facture mise à jour',
            data: facture,
        });
    } catch (error) {
        logger.error('Error updating facture', { error: error.message });
        next(error);
    }
});

/**
 * DELETE /api/v1/factures/:id
 * Supprimer une facture (brouillon uniquement)
 */
router.delete('/:id', validate({ params: paramsSchema }), verifyToken, checkRole(['ADMIN']), async (req, res, next) => {
    try {
        const { id } = req.params;

        const existing = await prisma.facture.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Facture non trouvée' });
        }

        if (existing.status !== 'brouillon') {
            return res.status(400).json({
                success: false,
                message: 'Seules les factures en brouillon peuvent être supprimées',
            });
        }

        await prisma.facture.delete({ where: { id } });

        logger.info('Facture deleted', { factureId: id });

        res.json({ success: true, message: 'Facture supprimée' });
    } catch (error) {
        logger.error('Error deleting facture', { error: error.message });
        next(error);
    }
});

/**
 * POST /api/v1/factures/:id/envoyer
 * Envoyer une facture (change le statut à "envoyee")
 */
router.post('/:id/envoyer', validate({ params: paramsSchema }), verifyToken, async (req, res, next) => {
    try {
        const { id } = req.params;

        const existing = await prisma.facture.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Facture non trouvée' });
        }

        if (existing.status !== 'brouillon') {
            return res.status(400).json({
                success: false,
                message: 'Cette facture a déjà été envoyée',
            });
        }

        const facture = await prisma.facture.update({
            where: { id },
            data: {
                status: 'envoyee',
                dateEmission: new Date(),
            },
        });

        logger.info('Facture sent', { factureId: id });

        res.json({
            success: true,
            message: 'Facture envoyée',
            data: facture,
        });
    } catch (error) {
        logger.error('Error sending facture', { error: error.message });
        next(error);
    }
});

/**
 * POST /api/v1/factures/:id/marquer-payee
 * Marquer une facture comme payée
 */
router.post('/:id/marquer-payee', validate({ params: paramsSchema }), verifyToken, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { modePaiement, reference } = req.body;

        const existing = await prisma.facture.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Facture non trouvée' });
        }

        if (existing.status === 'payee') {
            return res.status(400).json({
                success: false,
                message: 'Cette facture est déjà payée',
            });
        }

        const facture = await prisma.facture.update({
            where: { id },
            data: {
                status: 'payee',
                datePaiement: new Date(),
                modePaiement,
                reference,
            },
        });

        // Mettre à jour le statut de paiement de la mission si liée
        if (facture.missionId) {
            await prisma.mission.update({
                where: { id: facture.missionId },
                data: {
                    paymentStatus: 'paye',
                    datePaiement: new Date(),
                },
            });
        }

        logger.info('Facture marked as paid', { factureId: id });

        res.json({
            success: true,
            message: 'Facture marquée comme payée',
            data: facture,
        });
    } catch (error) {
        logger.error('Error marking facture as paid', { error: error.message });
        next(error);
    }
});

/**
 * POST /api/v1/factures/:id/generer-pdf
 * Génère le PDF d'une facture
 */
router.post('/:id/generer-pdf', validate({ params: paramsSchema }), verifyToken, async (req, res, next) => {
    try {
        const { id } = req.params;

        const facture = await prisma.facture.findUnique({
            where: { id },
            include: {
                mission: {
                    select: {
                        id: true,
                        title: true,
                        ecole: { select: { id: true, name: true, contactEmail: true, address: true } },
                        intervenant: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                siret: true,
                                user: { select: { email: true } },
                            },
                        },
                    },
                },
            },
        });

        if (!facture) {
            return res.status(404).json({ success: false, message: 'Facture non trouvée' });
        }

        // Récupérer les informations de l'émetteur et du destinataire
        let emetteur = { name: 'Vizion Academy' };
        let destinataire = { name: 'Client' };

        if (facture.emetteurType === 'intervenant' && facture.emetteurId) {
            const interv = await prisma.intervenant.findUnique({
                where: { id: facture.emetteurId },
                include: { user: { select: { email: true } } },
            });
            if (interv) {
                emetteur = {
                    name: `${interv.firstName || ''} ${interv.lastName || ''}`.trim() || 'Intervenant',
                    email: interv.user?.email,
                    siret: interv.siret,
                };
            }
        } else if (facture.emetteurType === 'ecole' && facture.emetteurId) {
            const ecole = await prisma.ecole.findUnique({
                where: { id: facture.emetteurId },
            });
            if (ecole) {
                emetteur = {
                    name: ecole.name,
                    email: ecole.contactEmail,
                    address: ecole.address,
                };
            }
        }

        if (facture.destinataireType === 'intervenant') {
            const interv = await prisma.intervenant.findUnique({
                where: { id: facture.destinataireId },
                include: { user: { select: { email: true } } },
            });
            if (interv) {
                destinataire = {
                    name: `${interv.firstName || ''} ${interv.lastName || ''}`.trim() || 'Intervenant',
                    email: interv.user?.email,
                    siret: interv.siret,
                };
            }
        } else if (facture.destinataireType === 'ecole') {
            const ecole = await prisma.ecole.findUnique({
                where: { id: facture.destinataireId },
            });
            if (ecole) {
                destinataire = {
                    name: ecole.name,
                    email: ecole.contactEmail,
                    address: ecole.address,
                };
            }
        }

        // Générer le PDF
        const pdfPath = await generateFacturePDF(facture, emetteur, destinataire);

        // Mettre à jour la facture avec le chemin du PDF
        await prisma.facture.update({
            where: { id },
            data: { pdfPath },
        });

        logger.info('PDF generated for facture', { factureId: id, pdfPath });

        res.json({
            success: true,
            message: 'PDF généré avec succès',
            data: { pdfPath },
        });
    } catch (error) {
        logger.error('Error generating PDF', { error: error.message });
        next(error);
    }
});

/**
 * GET /api/v1/factures/:id/pdf
 * Télécharge le PDF d'une facture
 */
router.get('/:id/pdf', validate({ params: paramsSchema }), verifyToken, async (req, res, next) => {
    try {
        const { id } = req.params;

        const facture = await prisma.facture.findUnique({ where: { id } });
        if (!facture) {
            return res.status(404).json({ success: false, message: 'Facture non trouvée' });
        }

        // Vérifier si le PDF existe
        let pdfPath = facture.pdfPath;
        if (!pdfPath || !fs.existsSync(pdfPath)) {
            // Essayer avec le chemin généré
            pdfPath = getFacturePDFPath(facture.numero);
            if (!fs.existsSync(pdfPath)) {
                return res.status(404).json({
                    success: false,
                    message: 'PDF non trouvé. Veuillez d\'abord générer le PDF.',
                });
            }
        }

        // Obtenir la taille du fichier
        const stat = fs.statSync(pdfPath);

        // Envoyer le fichier avec tous les headers nécessaires
        const fileName = `Facture-${facture.numero}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Cache-Control', 'no-cache');

        const fileStream = fs.createReadStream(pdfPath);

        fileStream.on('error', (err) => {
            logger.error('Error reading PDF file', { error: err.message, pdfPath });
            if (!res.headersSent) {
                res.status(500).json({ success: false, message: 'Erreur lors de la lecture du PDF' });
            }
        });

        fileStream.pipe(res);

        logger.info('PDF downloaded', { factureId: id, userId: req.user?.id, pdfPath });
    } catch (error) {
        logger.error('Error downloading PDF', { error: error.message });
        next(error);
    }
});

/**
 * GET /api/v1/factures/:id/preview-pdf
 * Prévisualise le PDF d'une facture (inline)
 */
router.get('/:id/preview-pdf', validate({ params: paramsSchema }), verifyToken, async (req, res, next) => {
    try {
        const { id } = req.params;

        const facture = await prisma.facture.findUnique({ where: { id } });
        if (!facture) {
            return res.status(404).json({ success: false, message: 'Facture non trouvée' });
        }

        let pdfPath = facture.pdfPath;
        if (!pdfPath || !fs.existsSync(pdfPath)) {
            pdfPath = getFacturePDFPath(facture.numero);
            if (!fs.existsSync(pdfPath)) {
                return res.status(404).json({
                    success: false,
                    message: 'PDF non trouvé. Veuillez d\'abord générer le PDF.',
                });
            }
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="Facture-${facture.numero}.pdf"`);

        const fileStream = fs.createReadStream(pdfPath);
        fileStream.pipe(res);
    } catch (error) {
        logger.error('Error previewing PDF', { error: error.message });
        next(error);
    }
});

export default router;
