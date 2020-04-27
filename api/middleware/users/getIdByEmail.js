const { Users } = require("../../../data/models");
module.exports = (req, res, next) => {
    Users.findBy({ email: req.body.email })
    .then(user => {
        req.body.userId = user.id;
        next();
    })
    .catch(err => {
        res.status(400).json({
            error: err, 
            message: 'Couldn\'t find a user with that email address.', 
            step: 'getIdByEmail middleware.'
        });
    })
}