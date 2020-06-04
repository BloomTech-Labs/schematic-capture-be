const { Projects } = require('../../../data/models');
const reqToDb = require('../../../utils/reqToDb');

module.exports = (req, res, next) => {
    const clientId = Number(req.params.id);

    Projects
        .setComplete(reqToDb({ clientId }))
        .then(projects => {
        //   projects = projects.map(project => dbToRes(project));
          next();
        }).catch(error => res.status(500).json({ error: error.message, step: "/couldnt do shit" }));
}