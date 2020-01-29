const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
    const { invite_token } = req.params;
    const secret = process.env.INVITE_SECRET;

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
