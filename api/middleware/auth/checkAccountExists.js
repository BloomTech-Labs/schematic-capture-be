const { Users } = require("../../../data/models");

module.exports = shouldExist => (req, res, next) => {
  const { uid } = req.decodedIdToken;

  Users.findBy(uid).then(users => {
    const accountExists = !!users.length;
    if (accountExists === shouldExist) {
      next();
    } else {
      res.status(203).json({ accountExists });
    }
  });
};
