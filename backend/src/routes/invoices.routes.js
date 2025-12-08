import { Router } from 'express';
import auth from '../middlewares/auth.middleware.js';
import hasRole from '../middlewares/hasRole.middleware.js';

import {
  listInvoices,
  getInvoice,
  generateInvoice,
  downloadInvoice,
  markInvoicePaid,
  webhookInvoice,
  regenerateInvoice,
  getInvoicePdfUrl
} from '../controllers/invoices.controller.js';

const router = Router();

/**
 * Public webhook endpoint for PSP (Stripe, MangoPay, etc.)
 * Note: PSPs often require raw body parsing (configure in app.js for this route).
 */
router.post('/webhook', webhookInvoice);

/**
 * USER endpoints (authenticated)
 * GET  /api/v1/invoices           -> list invoices (user: own; admin: all)
 * GET  /api/v1/invoices/:id       -> get invoice metadata
 * GET  /api/v1/invoices/:id/download -> returns signed URL or streams PDF (owner/admin)
 * POST /api/v1/invoices/generate  -> generate invoice for a resource (mission, refund, etc.)
 * POST /api/v1/invoices/:id/pay   -> (optional) mark invoice as paid (or used by webhook)
 */
router.get('/', auth, listInvoices);
router.get('/:id', auth, getInvoice);
router.get('/:id/download', auth, downloadInvoice);
router.get('/:id/pdf-url', auth, getInvoicePdfUrl); // alternative: get signed URL
router.post('/generate', auth, generateInvoice);
router.post('/:id/pay', auth, markInvoicePaid);

/**
 * ADMIN endpoints (ADMIN | SUPER_ADMIN)
 * POST /api/v1/invoices/:id/regenerate -> regenerate PDF (admin)
 */
router.post('/:id/regenerate', auth, hasRole('ADMIN', 'SUPER_ADMIN'), regenerateInvoice);

export default router;
