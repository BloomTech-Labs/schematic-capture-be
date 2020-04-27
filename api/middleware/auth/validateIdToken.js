const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../../utils/secrets');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization)
    return res.status(403).json({
      error: "must include an id token in the authorization header",
      step: "validateIdToken"
  });

  if (!authorization.startsWith("Bearer "))
    return res.status(403).json({
      error: "authorization must include a Bearer token",
      step: "validateIdToken"
  });

  const [, idToken] = authorization.split("Bearer ");

  jwt.verify(idToken, jwtSecret, (err, decodedToken) => {
    if (err) {
        res.status(401).json({ message: 'Invalid Credentials' });
    } else {
        req.decodedToken = decodedToken;
        next();
    }
  });
};
