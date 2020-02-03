const { admin } = require("../../utils/firebase");

module.exports = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    console.error("No token found");
    return res.status(403).json({ error: "Unauthorized" });
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedToken => {
      req.uid = decodedToken.uid;
      next();
    })

    .catch(error => {
      console.error("Error while verifying token ", error);
      return res.status(403).json({ error: "I'm here.." });
    });
};
