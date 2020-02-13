const router = require('express').Router();
const { Clients, Projects } = require('../../../data/models');
const { reqToDb } = require('../../../utils');

router.get('/', (req, res) => {
  Clients
    .findBy({ 'users_organizations.user_id': req.decodedIdToken.uid })
    .then(clients => res.status(200).json(clients))
    .catch(error => res.status(500).json({ error: error.message, step: '/' }));
});

router.get('/:id/projects', (req, res) => {
  const clientId = Number(req.params.id);

  Projects
    .findBy(reqToDb({ clientId }))
    .then(projects => res.status(200).json(projects))
    .catch(error => res.status(500).json({ error: error.message, step: '/' }));
});

router.post('/:id/projects', (req, res) => {
  const projectData = req.body;
  Projects
    .add(projectData)
    .then(project => res.status(201).json(project))
    .catch(error => res.status(500).json({ error: error.message, step: '/create' }));
});

router.post('/create', (req, res) => {
  const clientData = req.body;
  Clients
    .add(clientData)
    .then(client => res.status(201).json(client))
    .catch(error => res.status(500).json({ error: error.message, step: '/create' }));
});



module.exports = router;