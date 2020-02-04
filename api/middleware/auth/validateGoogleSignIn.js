const url = require("url");
const { admin } = require("../../../utils/firebase");

module.exports = (req, res, next) => {
  const { idToken, firstName, lastName } = req.body;

  if (idToken) {
    admin
      .auth()
      .verifyIdToken(idToken)
      .then(decodedToken => {
        const name = decodedToken.name.split(" ");
        const query = {
          email: decodedToken.email,
          uid: decodedToken.uid,
          firstName: firstName || name[0],
          lastName: lastName || name[name.length - 1],
          idToken
        };

        if (req.inviteToken) {
          res.redirect(
            url.format({
              pathname: "/api/auth/google/create",
              query: {
                ...query,
                ...req.body,
                ...req.inviteToken
              }
            })
          );
        } else {
          res.redirect(
            url.format({
              pathname: "/api/auth/google/signin",
              query
            })
          );
        }
      })
      .catch(error =>
        res.status(403).json({
          error: error.message,
          step: "validateGoogleSignIn"
        })
      );
  } else {
    return next();
  }
};
