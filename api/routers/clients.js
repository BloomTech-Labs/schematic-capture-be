const router = require('express').Router();

// middleware
const getUserInfo = require('../middleware/users/getUserInfo');

const { Clients, Projects, Jobsheets } = require('../../data/models');
const reqToDb = require('../../utils/reqToDb');
const dbToRes = require('../../utils/dbToRes');

router.get('/', async (req, res) => {
  try {

    let clients = await Clients.find();
    clients = clients.map(client => dbToRes(client));
    res.status(200).json(clients);

  } catch (error) {

    res.status(500).json({ error: error.message, step: '/' });

  }
});

router.get('/withcompleted', (req, res) => {
  Clients.find().then(async clients => {
    const clientsWithCompleted = await Promise.all(clients.map(async client => {
      await Jobsheets.findByClientId(client.id).then(completedCol => {
        if (completedCol.length > 0) { //has jobsheets
          for (let jobsheet of completedCol) {
            if (jobsheet.completed === false) { //0 for SQLite3, false for PostreSQL
              client.completed = false;
            }
          }
        } else { //doesn't have jobsheets
          client.completed = true;
        }
      });
      return client;
    }));
    res.status(200).json(clientsWithCompleted);
  }).catch(err => {
    res.status(500).json({
      error: err, 
      message: 'Failed to get client information.', 
      step: 'api/clients/withcompleted'
    });
  })
})

router.get('/:id/projects', (req, res) => {
  const clientId = Number(req.params.id);

  Projects
    .findBy(reqToDb({ clientId }))
    .then(projects => res.status(200).json(projects))
    .catch(error => res.status(500).json({ error: error.message, step: '/' }));
});

router.post('/:id/projects', async (req, res) => {
  const clientId = Number(req.params.id)

  try {
    const clients = await Clients.findByMultiple('organization_id', req.userOrganizations);

    if (!clients.map(client => client.id).includes(clientId)) {
      return res.status(400).json({ message: 'client not associated with this user' })
    }

    const projectData = req.body;
    projectData.clientId = clientId;
    
    const project = await Projects.add(reqToDb(projectData));

    res.status(201).json(project);

  } catch (error) {
      return res.status(500).json({ error: error.message, step: '/:id/projects' })
  }
});

router.post('/create', getUserInfo, (req, res) => {
  const clientData = req.body;
  const [organization] = req.userInfo.organizations;
  clientData.organizationId = organization.id;

  Clients
    .add(reqToDb(clientData))
    .then(client => res.status(201).json(client))
    .catch(error => res.status(500).json({ error: error.message, step: '/create' }));
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  let client;

  try { client = await Clients.findBy({ id }).first();

  if(!client) {
    return res 
    .status(404)
    .json({ errror: 'the specified client with this id does not exist'});
  }
  await Clients.update({ id }, req.body);

  return res.status(200).json({
    messsage: 'client has been updated'
  });
} catch (error) {
  return res.status(500).json({
    error: error.message, step: '/:id/clients'
  });
}
})



module.exports = router;