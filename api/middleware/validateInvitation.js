const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const secret = process.env.INVITE_SECRET;

  const { invite_token } = req.body;

  jwt.verify(invite_token, secret, (error, decoded) => {
    if (error) {
      return res
        .status(403)
        .json({ message: "please include a valid invite token" });
    } else {
      req.invite = decoded;
      next();
    }
  });
};
