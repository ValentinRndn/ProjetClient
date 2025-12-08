/**
 * ============================================
 * Vizion Academy - Contrôleur des Écoles
 * CDC : Gestion des écoles
 * ============================================
 */

import * as schoolService from "../services/schools.service.js";
import logger from "../utils/logger.js";

/**
 * POST /api/v1/schools
 * Créer une nouvelle école (ADMIN only)
 */
export async function createSchool(req, res, next) {
  try {
    const data = req.body;
    logger.info("Create school attempt", {
      name: data.name,
      adminId: req.user?.id,
    });

    const created = await schoolService.create(data, req.user.id);
    logger.info("School created successfully", {
      schoolId: created.id,
      name: created.name,
    });
    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    logger.error("Create school error", {
      name: req.body.name,
      error: err.message,
    });
    next(err);
  }
}

/**
 * GET /api/v1/ecoles/public
 * Liste publique des écoles (accessible à tous, pour filtres)
 * Retourne seulement id et name
 */
export async function getPublicSchools(req, res, next) {
  try {
    logger.info("Get public schools list");

    const schools = await schoolService.findAllPublic();
    logger.info("Public schools list retrieved", { count: schools.length });
    return res.json({ success: true, data: schools });
  } catch (err) {
    logger.error("Get public schools error", { error: err.message });
    next(err);
  }
}

/**
 * GET /api/v1/ecoles
 * Lister toutes les écoles (ADMIN only)
 */
export async function getSchools(req, res, next) {
  try {
    const { take, skip } = req.query;
    logger.info("Get schools list", { take, skip, requesterId: req.user?.id });

    const opts = {
      take: take ? parseInt(take, 10) : 50,
      skip: skip ? parseInt(skip, 10) : 0,
    };
    const list = await schoolService.findAll(opts);
    logger.info("Schools list retrieved", { count: list.length });
    return res.json({ success: true, data: list });
  } catch (err) {
    logger.error("Get schools error", { error: err.message });
    next(err);
  }
}

/**
 * GET /api/v1/schools/:id
 * Récupérer une école par son ID
 */
export async function getSchool(req, res, next) {
  try {
    const { id } = req.params;
    logger.info("Get school by ID", {
      schoolId: id,
      requesterId: req.user?.id,
    });

    const school = await schoolService.findById(id);
    if (!school) {
      logger.warn("School not found", { schoolId: id });
      return res
        .status(404)
        .json({ success: false, message: "École non trouvée." });
    }

    logger.info("School retrieved", { schoolId: id });
    return res.json({ success: true, data: school });
  } catch (err) {
    logger.error("Get school error", {
      schoolId: req.params.id,
      error: err.message,
    });
    next(err);
  }
}

/**
 * PATCH /api/v1/schools/:id
 * Mettre à jour une école
 */
export async function updateSchool(req, res, next) {
  try {
    const { id } = req.params;
    const payload = req.body;
    logger.info("Update school attempt", {
      schoolId: id,
      requesterId: req.user?.id,
    });

    const updated = await schoolService.update(id, payload);
    if (!updated) {
      logger.warn("Update school failed: not found", { schoolId: id });
      return res
        .status(404)
        .json({ success: false, message: "École non trouvée." });
    }

    logger.info("School updated successfully", { schoolId: id });
    return res.json({ success: true, data: updated });
  } catch (err) {
    logger.error("Update school error", {
      schoolId: req.params.id,
      error: err.message,
    });
    next(err);
  }
}

/**
 * DELETE /api/v1/schools/:id
 * Supprimer une école
 */
export async function deleteSchool(req, res, next) {
  try {
    const { id } = req.params;
    logger.info("Delete school attempt", {
      schoolId: id,
      requesterId: req.user?.id,
    });

    await schoolService.remove(id);
    logger.info("School deleted successfully", { schoolId: id });
    return res.json({ success: true, message: "École supprimée." });
  } catch (err) {
    logger.error("Delete school error", {
      schoolId: req.params.id,
      error: err.message,
    });
    next(err);
  }
}

/**
 * GET /api/v1/schools/:id/dashboard
 * Tableau de bord de l'école
 */
export async function dashboard(req, res, next) {
  try {
    const { id } = req.params;
    logger.info("Get school dashboard", {
      schoolId: id,
      requesterId: req.user?.id,
    });

    const data = await schoolService.getDashboard(id);
    logger.info("School dashboard retrieved", { schoolId: id });
    return res.json({ success: true, data });
  } catch (err) {
    logger.error("Get school dashboard error", {
      schoolId: req.params.id,
      error: err.message,
    });
    next(err);
  }
}

/**
 * POST /api/v1/schools/:id/declare-mission
 * Déclarer une mission pour une école (CDC)
 */
export async function declareMission(req, res, next) {
  try {
    const { id } = req.params;
    const payload = req.body;
    logger.info("Declare mission for school", {
      schoolId: id,
      title: payload.title,
      requesterId: req.user?.id,
    });

    const mission = await schoolService.declareMission(id, payload, req.user);
    logger.info("Mission declared successfully", {
      schoolId: id,
      missionId: mission.id,
    });
    return res.status(201).json({ success: true, data: mission });
  } catch (err) {
    logger.error("Declare mission error", {
      schoolId: req.params.id,
      error: err.message,
    });
    next(err);
  }
}
