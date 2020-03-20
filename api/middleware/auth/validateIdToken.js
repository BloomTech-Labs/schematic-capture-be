const { admin, firebase } = require("../../../utils/firebase");

//remove async when pushing
module.exports = async (req, res, next) => {

/************************** pure backend login ***************************/
  //creates the idToken the back-end is expecting from the front-end for
  //development and testing
  // Allows login and console logs idToken
  // if (process.env.DB_ENV === 'development') {
  //   const { email, password } = req.body;
  //   await firebase
  //     .auth()
  //     .signInWithEmailAndPassword(email, password)
  //     .then(data => {
  //       return data.user.getIdToken();
  //     })
  //     .then(idToken => {
  //       console.log('this is the idToken: \n', idToken);
  //       req.headers.authorization = `Bearer ${idToken}`;
  //     })
  //     .catch(error => console.log(error));
  // }
/************************** pure backend login ***************************/

/************************** pure backend Registration ***************************/
//This hasn't been tested
//Make sure you comment the "pure backend login" before hitting the /registration endpoint
//and testing
// if (process.env.DB_ENV === 'development') {
//   const { email, password } = req.body;
//   await firebase
//     .auth()
//     .createUserWithEmailAndPassword(email, password)
//     .then(data => {
//       return data.user.getIdToken();
//     })
//     .then(idToken => {
//       req.headers.authorization = `Bearer ${idToken}`
//     })
//     .catch(error => console.log(error));
// }

/************************** pure backend Registration ***************************/

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
