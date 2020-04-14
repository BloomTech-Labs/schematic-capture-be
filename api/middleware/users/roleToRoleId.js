const { Roles } = require('../../../data/models/');

//finds role id and adds it to the request
//matches roleId with groupId and adds it to the request
module.exports = (req, res, next) => {
    Roles.findBy({ name: req.body.role })
    .then(roles => {
        req.body.roleId = roles[0].id;
        //convert role id to group id
        switch (req.body.roleId) {
            case 1:
                //These groupIds will be different for SchemCap's groups
                req.groupId = '00g4ym8nmTwfhWeEm4x6';
                break;
            case 2:
                req.groupId = '00g4ymzijCXBwLK2h4x6';
                break;
            default:
                req.groupId = '00g4ym8k0Wc6sGqCW4x6';
                break;
        }
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