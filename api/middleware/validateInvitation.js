const jwt = require("jsonwebtoken");
const { validateSignupData } = require("./validation");

module.exports = (req, res, next) => {
    const { valid, errors } = validateSignupData(req.body);
    if (!valid) return res.status(400).json(errors);

    const secret = process.env.INVITE_SECRET;

    const { invite_token } = req.body;

    jwt.verify(invite_token, secret, (error, decoded) => {
        if (error) {
            return res
                .status(403)
                .json({ message: "please include a valid invite token" });
        } else {
            req.invite = decoded;
            next();
        }
    });
};
