const { Jobsheets } = require('../../../data/models');
const reqToDb = require('../../../utils/reqToDb');

module.exports = (req, res, next) => {
    const projectId = Number(req.params.id);
    Jobsheets
        .setComplete(reqToDb({ projectId }))
        .then(jobsheets => {
          next();
        }).catch(error => res.status(500).json({ error: error.message, step: "/couldnt do shit" }));
}