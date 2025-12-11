/**
 * ============================================
 * Vizion Academy - Contrôleur des Intervenants
 * CDC : Gestion des intervenants et documents
 * ============================================
 */

import * as intervenantsService from "../services/intervenants.service.js";
import logger from "../utils/logger.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * GET /api/v1/intervenants
 * Lister tous les intervenants
 */
export async function getIntervenants(req, res, next) {
  try {
    const { status, take, skip } = req.query;
    logger.info("Get intervenants list", {
      status,
      take,
      skip,
      requesterId: req.user?.id,
    });

    const opts = {
      status,
      take: take ? parseInt(take, 10) : undefined,
      skip: skip ? parseInt(skip, 10) : undefined,
    };
    const data = await intervenantsService.findAll(opts);
    logger.info("Intervenants list retrieved", { count: data.length });
    res.json({ success: true, data });
  } catch (err) {
    logger.error("Get intervenants error", { error: err.message });
    next(err);
  }
}

/**
 * GET /api/v1/intervenants/:id
 * Récupérer un intervenant par son ID
 */
export async function getIntervenant(req, res, next) {
  try {
    const { id } = req.params;
    logger.info("Get intervenant by ID", {
      intervenantId: id,
      requesterId: req.user?.id,
    });

    const data = await intervenantsService.findById(id);
    if (!data) {
      logger.warn("Intervenant not found", { intervenantId: id });
      return res
        .status(404)
        .json({ success: false, message: "Intervenant non trouvé." });
    }

    logger.info("Intervenant retrieved", { intervenantId: id });
    res.json({ success: true, data });
  } catch (err) {
    logger.error("Get intervenant error", {
      intervenantId: req.params.id,
      error: err.message,
    });
    next(err);
  }
}

/**
 * PATCH /api/v1/intervenants/:id
 * Mettre à jour un intervenant
 */
export async function updateIntervenant(req, res, next) {
  try {
    const { id } = req.params;
    const payload = req.body;
    logger.info("Update intervenant attempt", {
      intervenantId: id,
      requesterId: req.user?.id,
    });

    const updated = await intervenantsService.update(id, payload);
    if (!updated) {
      logger.warn("Update intervenant failed: not found", {
        intervenantId: id,
      });
      return res
        .status(404)
        .json({ success: false, message: "Intervenant non trouvé." });
    }

    logger.info("Intervenant updated successfully", { intervenantId: id });
    res.json({ success: true, data: updated });
  } catch (err) {
    logger.error("Update intervenant error", {
      intervenantId: req.params.id,
      error: err.message,
    });
    next(err);
  }
}

/**
 * PATCH /api/v1/intervenants/:id/status
 * Changer le statut d'un intervenant (pending, approved, rejected)
 */
export async function updateIntervenantStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    logger.info("Update intervenant status", {
      intervenantId: id,
      newStatus: status,
      requesterId: req.user?.id,
    });

    const updated = await intervenantsService.updateStatus(id, status);
    if (!updated) {
      logger.warn("Update intervenant status failed: not found", {
        intervenantId: id,
      });
      return res
        .status(404)
        .json({ success: false, message: "Intervenant non trouvé." });
    }

    logger.info("Intervenant status updated successfully", {
      intervenantId: id,
      newStatus: status,
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    logger.error("Update intervenant status error", {
      intervenantId: req.params.id,
      error: err.message,
    });
    next(err);
  }
}

/**
 * GET /api/v1/intervenants/:id/documents
 * Lister les documents d'un intervenant
 */
export async function getDocuments(req, res, next) {
  try {
    const { id } = req.params;
    logger.info("Get intervenant documents", {
      intervenantId: id,
      requesterId: req.user?.id,
    });

    const documents = await intervenantsService.getDocuments(id);
    logger.info("Intervenant documents retrieved", {
      intervenantId: id,
      count: documents.length,
    });
    res.json({ success: true, data: documents });
  } catch (err) {
    logger.error("Get intervenant documents error", {
      intervenantId: req.params.id,
      error: err.message,
    });
    next(err);
  }
}

/**
 * POST /api/v1/intervenants/:id/documents
 * Ajouter un document à un intervenant (CDC MVP - sans chiffrement)
 * Accepte FormData avec file + type OU JSON avec fileName/filePath/type
 */
export async function uploadDocument(req, res, next) {
  try {
    const { id } = req.params;

    let fileName, filePath, type;

    // Si un fichier a été uploadé via multer (FormData)
    if (req.file) {
      fileName = req.file.originalname;
      type = req.body.type || "AUTRE";

      // Créer le dossier uploads s'il n'existe pas
      const uploadsDir = path.join(__dirname, "../../uploads", id);
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Sauvegarder le fichier
      const uniqueName = `${Date.now()}-${fileName}`;
      filePath = path.join(uploadsDir, uniqueName);
      fs.writeFileSync(filePath, req.file.buffer);

      // Stocker le chemin relatif
      filePath = `uploads/${id}/${uniqueName}`;

      logger.info("File uploaded via FormData", {
        intervenantId: id,
        fileName,
        type,
        size: req.file.size,
        requesterId: req.user?.id,
      });
    } else {
      // Fallback : JSON body (ancien comportement)
      fileName = req.body.fileName;
      filePath = req.body.filePath;
      type = req.body.type;

      if (!fileName || !filePath || !type) {
        return res.status(400).json({
          success: false,
          message: "fileName, filePath et type sont requis",
        });
      }

      logger.info("Upload intervenant document via JSON", {
        intervenantId: id,
        fileName,
        type,
        requesterId: req.user?.id,
      });
    }

    const doc = await intervenantsService.addDocument(id, {
      fileName,
      filePath,
      type,
    });

    logger.info("Intervenant document uploaded successfully", {
      intervenantId: id,
      documentId: doc.id,
    });
    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    logger.error("Upload intervenant document error", {
      intervenantId: req.params.id,
      error: err.message,
    });
    next(err);
  }
}

/**
 * GET /api/v1/intervenants/:id/documents/:docId/download
 * Télécharger/afficher un document (public pour CV et photos de profil d'intervenants approuvés)
 */
export async function downloadDocument(req, res, next) {
  try {
    const { id, docId } = req.params;
    logger.info("Download intervenant document", {
      intervenantId: id,
      documentId: docId,
    });

    // Récupérer le document
    const document = await intervenantsService.getDocument(id, docId);
    if (!document) {
      return res
        .status(404)
        .json({ success: false, message: "Document non trouvé." });
    }

    // Vérifier que l'intervenant est approuvé (sécurité : seuls les CV/photos de profil des intervenants approuvés sont publics)
    const intervenant = await intervenantsService.findById(id);
    if (!intervenant || intervenant.status !== "approved") {
      return res
        .status(403)
        .json({ success: false, message: "Document non accessible." });
    }

    // Générer une URL signée S3 si le fichier est sur S3
    const filePath = document.filePath;
    if (filePath && filePath.startsWith("s3://")) {
      const { getSignedUrlFromS3 } = await import("../utils/s3.js");
      // Extraire la clé S3 (enlever 's3://bucket-name/')
      // Format attendu: s3://bucket-name/key ou s3://bucket-name/folder/key
      const match = filePath.match(/^s3:\/\/[^\/]+\/(.+)$/);
      if (match && match[1]) {
        const s3Key = match[1];
        const signedUrl = await getSignedUrlFromS3(s3Key, 3600); // URL valide 1h
        return res.redirect(signedUrl);
      } else {
        logger.error("Invalid S3 path format", { filePath });
        return res
          .status(400)
          .json({ success: false, message: "Format de chemin S3 invalide." });
      }
    }

    // Si le fichier est stocké localement, le servir directement
    if (filePath && filePath.startsWith("/")) {
      const absolutePath = path.resolve(process.cwd(), filePath);
      return res.sendFile(absolutePath);
    }

    // Si c'est une URL HTTP/HTTPS, rediriger
    if (
      filePath &&
      (filePath.startsWith("http://") || filePath.startsWith("https://"))
    ) {
      return res.redirect(filePath);
    }

    res.status(404).json({ success: false, message: "Fichier non trouvé." });
  } catch (err) {
    logger.error("Download intervenant document error", {
      intervenantId: req.params.id,
      documentId: req.params.docId,
      error: err.message,
    });
    next(err);
  }
}

/**
 * DELETE /api/v1/intervenants/:id/documents/:docId
 * Supprimer un document
 */
export async function deleteDocument(req, res, next) {
  try {
    const { id, docId } = req.params;
    logger.info("Delete intervenant document", {
      intervenantId: id,
      documentId: docId,
      requesterId: req.user?.id,
    });

    await intervenantsService.deleteDocument(id, docId);
    logger.info("Intervenant document deleted successfully", {
      intervenantId: id,
      documentId: docId,
    });
    res.json({ success: true, message: "Document supprimé." });
  } catch (err) {
    logger.error("Delete intervenant document error", {
      intervenantId: req.params.id,
      documentId: req.params.docId,
      error: err.message,
    });
    next(err);
  }
}
