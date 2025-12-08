export default function hasRole(...allowedRoles) {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ success: false, message: "Not authenticated" });
        }

        // user.role peut être string ou enum -> compare en string
        if (allowedRoles.includes(user.role)) {
            return next();
        }

        return res.status(403).json({ success: false, message: 'Forbidden: insufficient role'});
    }
}