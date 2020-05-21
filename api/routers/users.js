const router = require("express").Router();
const { Users } = require("../../data/models");
const dbToRes = require('../../utils/dbToRes');
const superRoleIdAuth = require('../middleware/auth/superRoleIdAuth')

router.get('/', superRoleIdAuth, (req, res) => {
    Users.find().then(users => {
        users = users.map(user => dbToRes(user));
        res.status(200).json(users);
    }).catch(err => {
        res.status(500).json({error: err, message: 'Couldn\'t get users', step: 'api/users/'});
    })
})

module.exports = router;