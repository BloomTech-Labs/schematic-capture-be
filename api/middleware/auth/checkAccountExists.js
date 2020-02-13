const { Users } = require("../../../data/models");

module.exports = shouldExist => (req, res, next) => {
  const { email } = req.decodedIdToken;

  Users._findBy({ email })
    .first()
    .then(user => {
      const accountExists = !!user;
      console.log({ accountExists })
      if (accountExists === shouldExist) {
        next();
      } else {
        res.status(400).json({ accountExists });
      }
    })
    .catch(error => res.status(500).json({ error: error.message, step: 'checkAccountExists' }))
};
