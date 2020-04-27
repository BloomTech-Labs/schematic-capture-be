module.exports = async (req, res, next) => {
    //front-end sends technician email, role, full name as name
    if (!req.body) {
        res.status(400).json({ message: "Missing post data. Ensure you sent the user's data." });
    } else if (!req.body.name || !req.body.email || !req.body.role) {
        res.status(400).json({ message: "Incomplete user data. Please include the user's name, role, and email." });
    } else {
        next();
    }
};
