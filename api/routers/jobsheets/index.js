const router = require('express').Router();
const { dbToRes, reqToDb } = require('../../../utils');
const { Projects, Jobsheets, Components } = require('../../../data/models');

router.post('/create', async (req, res) => {
  try {
    const jobsheet = await Jobsheets.add(reqToDb(req.body));
    res.status(201).json(jobsheet);
  } catch (error) {
    return res.status(500).json({ error: error.message, step: '/:id' })
  }

});


router.get('/assigned', async (req, res) => {
  const { email } = req.decodedIdToken;

  let jobsheets;

  try {
    jobsheets = await Jobsheets.findBy({ user_email: email })
  } catch (error) {
    return res.status(500).json({ error: error.message, step: '/assigned-getcomponents' });
  }

  let assignments;

  try {
    assignments = await Promise.all(jobsheets.map(async jobsheet => {
      const cameledJobsheet = dbToRes(jobsheet);
      const components = await Components.findBy({ jobsheet_id: jobsheet.id });

      cameledJobsheet.components = components.map(component => dbToRes(component));
      return cameledJobsheet;
    }))
  } catch (error) {
    return res.status(500).json({ error: error.message, step: '/assigned-getcomponents' });
  }
  
  let projectIds = assignments.map(jobsheet => jobsheet.projectId);
  let projects;

  try {
    projects = await Projects
                      .findByMultiple('projects.id', projectIds)
                      .select('projects.*', 'clients.company_name')
                      .join('clients', 'clients.id', 'projects.client_id');

  } catch (error) {
    return res.status(500).json({ error: error.message, step: '/assigned-getcomponents' });
  }

  projects = projects.map(project => {
    project.jobsheet = assignments.filter(jobsheet => jobsheet.projectId === project.id);
    return dbToRes(project);
  })

  return res.status(200).json(projects);

});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  Components
    .findBy({ jobsheet_id: id })
    .then(components => res.status(200).json(components.map(component => dbToRes(component))))
    .catch(error => res.status(500).json({ error: error.message, step: '/:id' }));
});

router.put('/:id/update', (req, res) => {
  /*
    req.body === [Component]
  */
  let jobsheetId = Number(req.params.id);


});


module.exports = router;