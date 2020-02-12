const { Roles } = require('../../../data/models');

module.exports = (req, res, next) => {
  const { roleId } = req.body;
  console.log(roleId)
  Roles
    .findBy({ 'roles.id': roleId })
    .then(role => {
      console.log(role)
      if (role.length) {
        next();
      } else {
        res.status(404).json({ message: 'role id does not exist' });
      }
    })
    .catch(error => res.status(500).json({ error: error.message, step: 'checkRoleExists' }));
}