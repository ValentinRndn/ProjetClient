/**
 * ============================================
 * Vizion Academy - Configuration
 * CDC Article 5 : Paramètres de l'application
 * ============================================
 */

const config = {
    // Port du serveur (CDC: 3001)
    port: process.env.PORT || 3001,
    
    // Environnement
    nodeEnv: process.env.NODE_ENV || 'development',
    
    // CORS
    corsOrigin: process.env.CORS_ORIGIN || '*',
    
    // JWT (CDC Article 5)
    jwt: {
        secret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
        accessExpiresIn: process.env.ACCESS_EXPIRES_IN || '15m',
        refreshExpiresIn: process.env.REFRESH_EXPIRES_IN || '7d',
    },
    
    // Base de données PostgreSQL (CDC Article 5 - OBLIGATOIRE)
    database: {
        url: process.env.DATABASE_URL,
    },
    
    // Bcrypt
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
    
    // Rate Limiting
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '15000', 10),
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    },
};

export default config;
