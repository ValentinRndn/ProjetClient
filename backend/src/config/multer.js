import multer from 'multer';
import path from 'path';
import logger from '../utils/logger.js';

// Configuration pour stocker les fichiers en mémoire (buffer)
const storage = multer.memoryStorage();

// Filtrage des types de fichiers autorisés
const fileFilter = (req, file, cb) => {
  // Types MIME autorisés pour les documents d'intervenants
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'text/plain'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    logger.warn('File type not allowed', { 
      originalName: file.originalname, 
      mimetype: file.mimetype 
    });
    cb(new Error(`File type ${file.mimetype} not allowed`), false);
  }
};

// Configuration multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
    files: 5 // Maximum 5 fichiers simultanés
  }
});

// Middleware pour upload de fichier unique
export const uploadSingle = (fieldName = 'file') => {
  return (req, res, next) => {
    const singleUpload = upload.single(fieldName);

    singleUpload(req, res, (err) => {
      if (err) {
        logger.error('Multer upload error', {
          error: err.message,
          fieldName,
          userId: req.user?.id
        });

        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File size too large (max 10MB)'
          });
        }

        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            success: false,
            message: 'Too many files (max 5)'
          });
        }

        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      // Vérifier qu'un fichier a bien été uploadé
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      logger.info('File uploaded via multer', {
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        userId: req.user?.id
      });

      next();
    });
  };
};

// Middleware optionnel pour upload - ne bloque pas si pas de fichier (supporte JSON et FormData)
export const uploadSingleOptional = (fieldName = 'file') => {
  return (req, res, next) => {
    const singleUpload = upload.single(fieldName);

    singleUpload(req, res, (err) => {
      if (err) {
        logger.error('Multer upload error', {
          error: err.message,
          fieldName,
          userId: req.user?.id
        });

        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File size too large (max 10MB)'
          });
        }

        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      // Log seulement si un fichier est présent
      if (req.file) {
        logger.info('File uploaded via multer', {
          originalName: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
          userId: req.user?.id
        });
      }

      next();
    });
  };
};

// Middleware pour upload de fichiers multiples
export const uploadMultiple = (fieldName = 'files', maxCount = 5) => {
  return (req, res, next) => {
    const multipleUpload = upload.array(fieldName, maxCount);
    
    multipleUpload(req, res, (err) => {
      if (err) {
        logger.error('Multer multiple upload error', { 
          error: err.message,
          fieldName,
          userId: req.user?.id 
        });
        
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File size too large (max 10MB)'
          });
        }
        
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded'
        });
      }
      
      logger.info('Multiple files uploaded via multer', {
        count: req.files.length,
        files: req.files.map(f => ({ name: f.originalname, size: f.size })),
        userId: req.user?.id
      });
      
      next();
    });
  };
};

export default upload;