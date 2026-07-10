const authorizationMiddleware = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return res.status(403).json({
				status: "failed",
				message: "You have no access over this action",
			});
		}
		next();
	};
};

module.exports = authorizationMiddleware;
