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
          let test;
          if (process.env.DB_ENV === 'test' || process.env.DB_ENV === 'development') {
            test = 0;
          } else {
            test = false;
          }
          for (let jobsheet of completedCol) {
            if (jobsheet.completed === test) { //0 for SQLite3, false for PostreSQL
              client.completed = false;
              return client;
            }
          }
          client.completed = true;
        } else { //doesn't have jobsheets
          client.completed = true;
        }
      });
      return client;
    }));
    //This is currently returning snake case. Should be switched to camel case for front-end
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

  //id returning snake case, needs to be converted to camelCase for front-end
  Projects
    .findBy(reqToDb({ clientId }))
    .then(projects => res.status(200).json(projects))
    .catch(error => res.status(500).json({ error: error.message, step: '/' }));
});

router.post('/:id/projects', async (req, res) => {
  const clientId = Number(req.params.id)

  try {
    const projectData = req.body;
    projectData.clientId = clientId;
    projectData.completed = false;
    
    const project = await Projects.add(reqToDb(projectData));

    res.status(201).json(project);

  } catch (error) {
      return res.status(500).json({ error: error.message, step: '/:id/projects' })
  }
});

router.post('/create', getUserInfo, (req, res) => {
  const clientData = req.body;

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
  //expects snake case
  await Clients.update({ id }, req.body);

  return res.status(200).json({
    message: 'client has been updated'
  });
} catch (error) {
  return res.status(500).json({
    error: error.message, step: '/:id/clients'
  });
}
})



module.exports = router;