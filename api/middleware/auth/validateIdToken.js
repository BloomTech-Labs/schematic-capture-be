const { admin } = require("../../../utils/firebase");

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

  const [, idToken] = req.headers.authorization.split("Bearer ");

  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedIdToken => {
      req.decodedIdToken = decodedIdToken;
      next();
    })
    .catch(error => {
      res.status(403).json({ error: error.code, step: "validateIdToken" });
    });
};
