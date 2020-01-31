const { admin } = require("../../utils/firebase");

module.exports = (req, res, next) => {
    const { token } = req.body;
    if (token) {
        admin
            .auth()
            .verifyIdToken(token)
            .then(decodedToken => {
                console.log(decodedToken);
                req.uid = decodedToken.uid;
                req.token = token;
                return next();
            })

            .catch(error => {
                console.error("Error while verifying token ", error);
                return res.status(403).json({ error: "I'm here.." });
            });
    } else {
        return next();
    }
};
