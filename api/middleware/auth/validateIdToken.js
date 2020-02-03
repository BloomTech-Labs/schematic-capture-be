const { admin } = require("../../utils/firebase");

module.exports = (req, res, next) => {
  if (!req.headers.authorization)
    return res.status(403).json({
      error: "must include an id token in the authorization header",
      step: "validateIdToken"
    });

  if (!req.headers.authorization.startsWith("Bearer "))
    return res.status(403).json({
      error: "authorization must include a Bearer token",
      step: "validateIdToken"
    });

  const [, idToken] = req.header.authorization.split("Bearer ");

  admin
    .auth(idToken)
    .verifyIdToken(idToken)
    .then(decodedToken => {
      req.uid = decodedToken.uid;
      next();
    })
    .catch(error => {
      res
        .status(403)
        .json({ error: "not a valid id token", step: "validateIdToken" });
    });
};
