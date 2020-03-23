const { Projects } = require ('../../../data/models')

module.exports = (req, res, next) => {
    console.log(`middleware for assigning technicians jobs ${req.body.assigned_user_id}`)
    if(req.body.assigned_user_id) {
        next()
    } else {
        res.status(400).json({ message: 'does not update assigned_user_id' })
    }
}