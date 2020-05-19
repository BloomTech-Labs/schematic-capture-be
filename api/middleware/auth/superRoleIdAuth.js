module.exports = async (req, res, next) => {
    const { roleId } = req.decodedToken;

    if (roleId !== 1) {
        res.status(400).json({
            message: "access denied",
        });
    } else {
        next();
    }
};
