/**
 * ============================================
 * Vizion Academy - Serveur Express
 * CDC Article 5 : Port 3001
 * ============================================
 */

import 'dotenv/config';
import app from './app.js';
import config from './config/index.js';
import logger from './utils/logger.js';
import prisma from '../prisma.js';

const PORT = config.port;

// ============================================
// Démarrage du serveur
// ============================================
async function startServer() {
    try {
        // Vérifier la connexion à la base de données PostgreSQL (CDC Article 5)
        await prisma.$connect();
        logger.info('✅ Connected to PostgreSQL database');

        // Démarrer le serveur Express
        app.listen(PORT, () => {
            logger.info(`🚀 Vizion Academy API running on port ${PORT}`);
            logger.info(`📍 Environment: ${config.nodeEnv}`);
            logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        logger.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// ============================================
// Gestion de l'arrêt gracieux
// ============================================
async function gracefulShutdown(signal) {
    logger.info(`\n${signal} received. Shutting down gracefully...`);
    
    try {
        await prisma.$disconnect();
        logger.info('✅ Disconnected from PostgreSQL database');
        process.exit(0);
    } catch (error) {
        logger.error('❌ Error during shutdown:', error);
        process.exit(1);
    }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Démarrer le serveur
startServer();
