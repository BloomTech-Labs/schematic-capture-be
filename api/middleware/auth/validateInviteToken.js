const jwt = require("jsonwebtoken");
const { admin } = require('../../../utils/firebase');
const { InviteTokens } = require('../../../data/models');

module.exports = async (req, res, next) => {
  const secret = process.env.INVITE_SECRET;
  const { auth } = admin;
  const { uid } = req.decodedIdToken;
  const { inviteToken } = req.body;

  if (!inviteToken && req.url === '/register') {
    await auth().deleteUser(uid)
    return res.status(400).json({
      error: "no invite token included in request body",
      step: "validateInviteToken"
    });
  }

  const tokenIsUsed = await InviteTokens.findBy({ id: inviteToken }).first();

  if (tokenIsUsed && req.url === '/register') {
    await auth().deleteUser(uid)
    return res.status(400).json({ 
      error: 'invite token has already been used',
      step: 'validateInviteToken'
    });
  }

  jwt.verify(inviteToken, secret, async (error, decoded) => {
    if (error) {
      if (req.url === '/register') {
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
