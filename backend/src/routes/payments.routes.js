import { Router } from "express";

import {
  createPaymentIntent,
  getPayment,
  listPayments,
  refundPayment,
  handleStripeWebhook
} from "../controllers/payments.controller.js";

import auth from "../middlewares/auth.middleware.js";
import hasRole from "../middlewares/hasRole.middleware.js";

const router = Router();

/**
 * PUBLIC WEBHOOK (Stripe appelle cette route)
 * ⚠️ Important : PAS de JSON middleware ici !
 * Stripe demande un raw body.
 */
router.post("/webhook", handleStripeWebhook);

/**
 * USER : créer un paiement pour une mission, un challenge, un service...
 * POST /payments/intent
 */
router.post("/intent", auth, createPaymentIntent);

/**
 * USER : obtenir détail d’un paiement
 * GET /payments/:id
 */
router.get("/:id", auth, getPayment);

/**
 * ADMIN : liste des paiements avec filtres (date, user, status...)
 * GET /payments
 */
router.get(
  "/",
  auth,
  hasRole("ADMIN", "SUPER_ADMIN"),
  listPayments
);

/**
 * ADMIN : effectuer un remboursement
 * POST /payments/:id/refund
 */
router.post(
  "/:id/refund",
  auth,
  hasRole("ADMIN", "SUPER_ADMIN"),
  refundPayment
);

export default router;
