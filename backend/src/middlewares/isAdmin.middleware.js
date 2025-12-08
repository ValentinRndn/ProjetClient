import hasRole from './hasRole.middleware.js';

export default function isAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin only" });
  }
  next();
}

// Alternative using hasRole middleware
export const adminRole = hasRole('ADMIN', 'SUPER_ADMIN');
