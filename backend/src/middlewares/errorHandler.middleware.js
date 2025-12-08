export default function errorHandler(err, req, res, next) {
  // Status HTTP par défaut
  const status = err.status || 500;

  // Log interne (serveur)
  console.error("🔥 ERROR:", {
    message: err.message,
    status,
    path: req.originalUrl,
    method: req.method,
    stack: err.stack
  });

  // Erreurs JWT
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Token invalide"
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expiré"
    });
  }

  // Erreurs validation (tu pourras brancher Joi/Yup/Zod ici)
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: err.message,
      errors: err.errors || null
    });
  }

  // Réponse générique
  const response = {
    success: false,
    message: err.message || "Erreur interne du serveur"
  };

  // Stack → seulement en DEV
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(status).json(response);
}
