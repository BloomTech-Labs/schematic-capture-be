const { Roles } = require('../../../data/models');

module.exports = (req, res, next) => {
  const { roleId } = req.body;
  Roles
    .findBy({ id: roleId })
    .first()
    .then(role => {
      if (!!Object.entries(role).length) {
        next();
      } else {
        res.status(404).json({ message: 'role id does not exist' });
      }
    })
    .catch(error => res.status(500).json({ error: error.message, step: 'checkRoleExists' }));
}