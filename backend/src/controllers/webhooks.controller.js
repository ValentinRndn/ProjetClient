export async function stripeWebhook(req, res) {
    try {
        const sig = req.headers["stripe-signature"];
        const event = stripe.webhooks.contructEvent(
            req.body, 
            sig, 
            process.env.STRIPE_WEBHOOK_SECRET
        );

        // Gestion de l'évenement Stripe
        switch(event.type) {
            case "payment_intent.succeeded":
                //update DB
                break;
            case "charge.refunded":
                //update DB
                break;
        }
        return res.sendStatus(200);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`)
    }
}

export async function genericPaymentWebhook(req, res) {
    const provider = req.headers['x-provider'] || "unknow";

    // Traitement selon provider
    // Exemple : MangoPay, Paypal, PayPlug...
    return res.sendStatus(200);
}

export async function emailWebhook(req, res) {
    const event = req.body.event || req.body.type;

    //Exemple:
    //delivered, opened, clicked, bounced, spam, unsubscribed...
    return res.sendStatus(200);
}

export async function storageWebhook(req, res) {
    // EX : S3 -> event : ObjectCreated, ObjectDeleted
    const records = req.body.Records || [];

    for (const record of records) {
        const key = record.s3.object.key;
        const eventName = record.eventName;

        //update logs or DB
    }
     return res.sendStatus(200)
}

export async function logWebhookEvent(req, res) {
    console.log("Webhook LOG:", req.body);
    return res.sendStatus(200);
}