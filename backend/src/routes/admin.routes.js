import { Router } from 'express';
import {
    listUsers, 
    getLogs, 
    validateIntervenant,
    createExport,
    getExport,
    getStats,
    reloadChache
} from '../controllers/admin.controller.js';

import auth from '../middlewares/auth.middleware.js';
import hasRole from '../middleware/hasRole.middleware.js';

const router = Router();

// route admin protégées (ADMIN+SUPER_ADMIN)
router.use(auth, hasRole('ADMIN', 'SUPER_ADMIN'));

// Users
router.get('/users', listUsers);

// Logs (audit)
router.get('/logs', getLogs);

// Intervenant validation
router.post('/intervenants/:id/validate', validateIntervenant);

// Exports
router.post('/export', createExport);
router.get('/export/:id', getExport);

// Stats / dashboard
router.get('/stats', getStats);

// Ops: reload cache (internal)
router.post('/reload-cache', reloadCache);

export default router;