export function authorizeRole(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role.toLowerCase())) {
            return res.status(403).json({
                message: "Forbidden",
            });
        }

        next();
    };
}