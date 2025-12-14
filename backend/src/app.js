/**
 * ============================================
 * Vizion Academy - Application Express
 * CDC : MVP Back-end
 * Port: 3001, CORS, JSON, Routes API
 * ============================================
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import allRoutes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.middleware.js';
import config from './config/index.js';
import logger from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ============================================
// Middlewares de sécurité et parsing
// ============================================
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
}));
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// ============================================
// Routes API (CDC)
// ============================================
app.use('/api/v1', allRoutes);

// ============================================
// Route de santé
// ============================================
app.get('/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Vizion Academy API is running',
        timestamp: new Date().toISOString()
    });
});

// ============================================
// Gestion des erreurs 404
// ============================================
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Route non trouvée."
    });
});

// ============================================
// Middleware de gestion des erreurs
// ============================================
app.use(errorHandler);

export default app;