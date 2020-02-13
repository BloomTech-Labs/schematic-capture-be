const { Users } = require('../../../data/models');
const getUserInfo = (req, res, next) => {
  const { email } = req.decodedIdToken;

  Users
    .findBy(email)
    .then(user => {
      req.userInfo = user;
      next();
    })
    .catch(error => res.status(500).json({ error: error.message, step: '/getUserInfo' }))
}

module.exports = {
  getUserInfo
}