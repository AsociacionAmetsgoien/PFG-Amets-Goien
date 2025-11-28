
// Middleware to verify user roles when accessing protected routes


export const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const userRole = req.user.role;

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ 
                message: 'You do not have permission to access this resource',
                requiredRoles: allowedRoles,
                yourRole: userRole
            });
        }

        next();
    };
};
