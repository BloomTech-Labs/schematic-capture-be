const { Users } = require("../../../data/models");

module.exports = (req, res, next) => {
  Users.findBy({ "users.id": req.query.uid }).then(users => {
    if (users.length) {
      next();
    } else {
      res.status(203).json({ needRegister: true });
    }
  });
};
