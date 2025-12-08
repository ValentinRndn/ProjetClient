import { Router } from 'express';
import { stripeWebhook, genericPaymentWebhook, emailWebhook, storageWebhook, logWebhookEvent } from '../controllers/webhooks.controller.js';

/**
 * VERY IMPORTANT:
 * For webhooks like Stripe that REQUIRE raw body, configure this route BEFOR express.json()
 * in your main app.js:
 * 
 * app.use('/api/v1/webhooks/stripe', express.raw({ type: 'application/json' }));
 * then:
 * app.use('/api/v1/webhooks', webhooksRoutes);
 */

const router = Router();

/**
 * Stripe Webhook (requires raw body)
 * POST /api/v1/webhooks/stripe
 */
router.post("/stripe", stripeWebhook);

/**
 * Generic payment webhook (Paypal, MangoPay, Payplig, Lemonway...)
 * POST /api/v1/webhooks/payment
 */
router.post("/payment", genericPaymentWebhook);


/**
 * Email provider webhooks (Brevo, SendInBlue, Mailgun, Resend...)
 * POST /api/v1/webhooks/email
 */
router.post("/email", emailWebhook);

/**
 * Storage / Bucket events (AWS S3, CloudFaire R2, Minio...)
 * POST /apî/v1/webhooks/storage
 */
router.post("/storage", storageWebhook);

/**
 * Generic fallback webhook (si un provider te ping dans une URL custom)
 * POST /api/v1/webhooks/log
 */
router.post("/log", logWebhookEvent);

export default router;