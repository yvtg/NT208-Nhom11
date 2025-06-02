const adminMiddlewares = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden: Insufficient rights" });
    }
    next();
};

export default adminMiddlewares;
