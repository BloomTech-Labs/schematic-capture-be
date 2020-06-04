module.exports = async (req, res, next) => {
	const { roleId } = req.decodedToken;

	if (roleId === 1 || roleId === 2) {
		next();
	} else {
		res.status(400).json({
			message: "access denied",
		});
	}
};
