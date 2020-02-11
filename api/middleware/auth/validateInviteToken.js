const { admin } = require('../../../utils/firebase');
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const secret = process.env.INVITE_SECRET;

  const { inviteToken } = req.body;

  if (!inviteToken)
    return res.status(400).json({
      error: "no invite token included in request body",
      step: "validateInviteToken"
    });

  jwt.verify(inviteToken, secret, async (error, decoded) => {
    if (error) {
      if (req.url === '/register') {
        const { auth } = admin;
        const { uid } = req.decodedIdToken;
        await auth().deleteUser(uid)
      }

      return res.status(403).json({ error, step: "validateInviteToken" });
    } else {
      req.inviteToken = inviteToken;
      req.decodedInviteToken = decoded;
      next();
    }
  });
};
