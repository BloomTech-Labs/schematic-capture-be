const router = require('express').Router();
const dbToRes = require('../../utils/dbToRes');
const reqToDb = require('../../utils/reqToDb');
const { Projects, Jobsheets, Components } = require('../../data/models');

//TODO: This endpoint is weak on validation. I recommend adding more validation middleware when there's time.

//Works as long as the custom column is included in the database.
router.post('/create', async (req, res) => {
  try {
    const jobsheet = await Jobsheets.add(reqToDb(req.body));
    res.status(201).json(dbToRes(jobsheet));
  } catch (error) {
    return res.status(500).json({ error: error.message, step: '/create' });
  }
});

//works
//This endpoint users the Bearer token to return the the projects the user is assigned to, the jobsheets they are assigned to and the components for each jobsheet.
router.get('/assigned', async (req, res) => {
  const { email } = req.decodedToken;

  let jobsheets;

  try {
    jobsheets = await Jobsheets.findBy({ user_email: email });
  } catch (error) {
    return res.status(500).json({ error: error.message, step: '/assigned-getcomponents' });
  }

  console.log(jobsheets);

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

//works
router.get('/:id/components', async (req, res) => {
  const id = Number(req.params.id);

  Components
    .findBy({ jobsheet_id: id })
    .then(components => res.status(200).json(components.map(component => dbToRes(component))))
    .catch(error => res.status(500).json({ error: error.message, step: '/:id-Components.findBy' }));
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  Jobsheets.findBy({ id })
    .then(jobsheet => res.status(200).json(dbToRes(jobsheet[0])))
    .catch(error => res.status(500).json({ error: error.message, step: '/:id' }));
});

router.put('/:id/update', (req, res) => {
  const id = Number(req.params.id);

  Jobsheets.update({ id }, req.body)
    .then(jobsheet => {
      res.status(201).json(dbToRes(jobsheet[0]));
    }).catch(error => {
      res.status(500).json({ error: error.message, step: '/:id/update' });
    });
});


module.exports = router;