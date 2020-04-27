module.exports = (req, res, next) => {
    if(req.body.email) {
        next()
    } else {
        res.status(400).json({ 
            message: 'Please include the email of the user you want to assign to the project.', 
            step: 'checkBodyForAssigned' 
        });
    }
}