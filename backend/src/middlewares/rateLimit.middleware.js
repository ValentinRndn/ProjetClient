const rateMap = new Map();

/**
 * rateLimit (options)
 * windowMs: 10_000 (ms)
 * limit: 20 (max requests)
 */
export default function rateLimit(options = {}) {
    const windowMs = options.windowMs || 15_000;
    const limit = options.limit || 30;
    const message = options.message || 'Too many requests, please try again later.';

    return (req, res, next) => {
        const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        const now = Date.now();
        const windowStart = now - windowMs;

        // Initialiser tableau pour cet IP
        if (!rateMap.has(ip)) {
            rateMap.set(ip, []);
        }
        
        // Garder uniquement les requêtes encore dans la fenêtre
        const hits = rateMap.get(ip).filter(ts => ts > windowStart);

        // Ajouter hit actuel
        hits.push(now);

        // Réinjecter le tableau filtré
        rateMap.set(ip, hits);

        // Vérifier limite
        if (hits.length > limit) {
            return res.status(429).json({ success: false, message, retryAfter: windowMs / 1000  });
        }

        next();
    }
}