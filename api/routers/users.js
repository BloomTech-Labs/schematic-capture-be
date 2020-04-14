const router = require("express").Router();
const { Users } = require("../../data/models");

router.get('/', (req, res) => {
    Users.find().then(users => {
        res.status(200).json(users);
    }).catch(err => {
        res.status(500).json({error: err, message: 'Couldn\'t get users', step: 'api/users/'});
    })
})

module.exports = router;