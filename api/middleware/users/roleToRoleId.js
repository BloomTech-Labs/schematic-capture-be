const { Roles } = require('../../../data/models/');

//finds role id and adds it to the request
module.exports = (req, res, next) => {
    Roles.findBy({ name: req.body.role })
    .then(roles => {
        req.body.roleId = roles[0].id;
        next();
    })
    .catch(err => {
        error => res.status(500).json({ 
            message: 'No matching role found in database.',
            error: error.message, 
            step: 'roleToRoleId' 
        })
    });
}