const { admin } = require("../../utils/firebase");

module.exports = (req, res, next) => {
    const { token } = req.body;
    if (token) {
        admin
            .auth()
            .verifyIdToken(token)
            .then(decodedToken => {
                req.email = decodedToken.email;
                req.uid = decodedToken.uid;
                req.token = token;

                console.log(req.uid);
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
