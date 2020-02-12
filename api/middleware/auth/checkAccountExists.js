const { Users } = require("../../../data/models");

module.exports = shouldExist => (req, res, next) => {
  const { uid } = req.decodedIdToken;

  Users._findBy({ 'users.id': uid })
    .first()
    .then(user => {
      const accountExists = !!user;
      if (accountExists === shouldExist) {
        next();
      } else {
        res.status(400).json({ accountExists });
      }
    })
    .catch(error => res.status(500).json({ error: error.message, step: 'checkAccountExists' }))
};
