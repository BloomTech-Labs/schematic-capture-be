const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const secret = process.env.INVITE_SECRET;

  const { invite_token } = req.body;

  if (!invite_token)
    return res.status(400).json({
      error: "no invite token included in request body",
      step: "validateInviteToken"
    });

  jwt.verify(invite_token, secret, (error, decoded) => {
    if (error) {
      return res.status(403).json({ error, step: "validateInviteToken" });
    } else {
      req.invite = decoded;
      next();
    }
  });
};
