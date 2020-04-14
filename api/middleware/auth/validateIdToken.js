const { admin, firebase } = require("../../../utils/firebase");

//remove async when pushing
module.exports = async (req, res, next) => {

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
  req.token = idToken;

  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedIdToken => {
      const isRegister = req.url === '/register';
      const isPassword = decodedIdToken.sign_in_provider === 'password';
      req.canDeleteFirebaseAccount = isRegister && isPassword;
      req.decodedIdToken = decodedIdToken;
      next();
    })
    .catch(error => {
      res.status(403).json({ error: error.code, step: "validateIdToken" });
    });
};
