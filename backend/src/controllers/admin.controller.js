import * as adminService from '../services/admin.service.js';

/**
 * GET /api/v1/admin/users
 * query: ?take=&skip=&q=&role=
 */
export async function listUsers(req, res, next) {
    try {
        const { take, skip, q, role } = req.query;
        const opts = {
            take: take ? parseInt(take, 10) : 50,
            skip: skip ? parseInt(skip, 10) : 0,
            q: q || null,
            role: role || null
        };
        const data = await adminService.listUsers(opts);
        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
}

/**
 * GET /api/v1/admin/logs
 * query: ?take=&skip=&q=
 */
export async function getLogs(req, res, next) {
    try {
        const { take, skip, q } = req.query;
        const opts = {
            take: take ? parseInt(take, 10) : 100,
            skip: skip ? parseInt(skip, 10) : 0,
            q: q || null
        };
        const data = await adminService.getLogs(opts);
        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
}

/**
 * POST /api/v1/admin/intervenants/:id/validate
 * body : { status: 'approved' | 'rejected', | reason?: string }
 */
export async function validateIntervenant(req, res, next) {
    try {
        const { id } = req.params;
        const { status, reason } = req.body;
        if(!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }
        const result = await adminService.validateIntervenant(id, status, reason);
        res.json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
}

/**
 * POST /api/v1/admin/export
 * body: { resource: 'users'|'missions'|..., filters?: {} }
 * -> lance un job (ici stub) et renvoie l'id export
 */
export async function createExport(req, res, next) {
  try {
    const { resource, filters } = req.body;
    if (!resource) return res.status(400).json({ success: false, message: 'resource required' });

    const exportRecord = await adminService.createExport(resource, filters || {}, req.user);
    res.status(201).json({ success: true, data: exportRecord });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/admin/export/:id
 */
export async function getExport(req, res, next) {
  try {
    const { id } = req.params;
    const data = await adminService.getExport(id);
    if (!data) return res.status(404).json({ success: false, message: 'Export not found' });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/admin/stats
 */
export async function getStats(req, res, next) {
  try {
    const data = await adminService.getStats();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/admin/reload-cache
 * -> simple endpoint pour invalider/rafraîchir caches (implémenter la logique si besoin)
 */
export async function reloadCache(req, res, next) {
  try {
    await adminService.reloadCache();
    res.json({ success: true, message: 'Cache reloaded' });
  } catch (err) {
    next(err);
  }
}