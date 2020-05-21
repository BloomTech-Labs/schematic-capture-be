const router = require("express").Router();
const { Roles } = require("../../data/models");
const superRoleIdAuth = require('../middleware/auth/superRoleIdAuth')

router.get("/", superRoleIdAuth, (req, res) => {
  Roles.find()
    .then(roles => res.status(200).json(roles))
    .catch(error => res.status(500).json({ error: error.message, step: 'api/roles' }));
});

module.exports = router;