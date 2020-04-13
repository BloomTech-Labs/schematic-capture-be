const { Projects } = require ('../../../data/models')

module.exports = (req, res, next) => {
    const { id } = req.params;
    console.log('project id', id)
    Projects
      .findBy({ id })
      .then(proj => {
        console.log(proj)
        if (proj && Object.entries(proj).length) {
          next();
        } else {
          res.status(404).json({ message: 'project with the given id does not exist' });
        }
      })
      .catch(error => res.status(500).json({ error: error.message, step: 'checkIfProjectExists' }));
  }