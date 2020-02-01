const url = require("url");
const { admin } = require("../../utils/firebase");

module.exports = (req, res, next) => {
  const { token } = req.body;
  if (token) {
    admin
      .auth()
      .verifyIdToken(token)
      .then(decodedToken => {
        const query = {
          email: decodedToken.email,
          uid: decodedToken.uid,
          idToken: token
        };

        if (req.invite_token) {
          res.redirect(
            url.format({
              pathname: "/api/auth/google/create",
              query: {
                ...query,
                ...req.body,
                inviteToken: req.invite_token
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
