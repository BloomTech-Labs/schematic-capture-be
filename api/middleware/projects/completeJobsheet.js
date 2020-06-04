const { Jobsheets } = require('../../../data/models');
const reqToDb = require('../../../utils/reqToDb');

module.exports = (req, res, next) => {
    const clientId = Number(req.params.id);
    Jobsheets
        .setComplete(reqToDb({ clientId }))
        .then(jobsheets => {
          next();
        }).catch(error => res.status(500).json({ error: error.message, step: "/couldnt do shit" }));
}