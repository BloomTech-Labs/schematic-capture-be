const checkAccountExists = require("./checkAccountExists");
const validateGoogleSignIn = require("./validateGoogleSignIn");
const validateIdToken = require("./validateIdToken");
const validateInviteToken = require("./validateInviteToken");
const validateLogin = require("./validateLogin");
const validateRegistration = require("./validateRegistration");

module.exports = {
  checkAccountExists,
  validateGoogleSignIn,
  validateIdToken,
  validateInviteToken,
  validateLogin,
  validateRegistration
};
