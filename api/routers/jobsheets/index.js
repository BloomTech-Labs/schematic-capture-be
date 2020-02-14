const router = require('express').Router();
const { dbToRes, reqToDb } = require('../../../utils');
const { Jobsheets, Components } = require('../../../data/models');

router.post('/create', (req, res) => {
  Jobsheets
    .add(reqToDb(req.body)) 
    .then(() => res.status(201).json('uploaded successfully'))
    .catch(error => res.status(500).json({ error: error.message, step: '/create' }))
});

router.get('/assigned', async (req, res) => {
  const { email } = req.decodedIdToken;

  let jobsheets;

  try {
    jobsheets = await Jobsheets.findBy({ user_email: email })
  } catch (error) {
    return res.status(500).json({ error: error.message, step: '/assigned-getcomponents' });
  }

  let assigned;

  try {
    assigned = await Promise.all(jobsheets.map(async jobsheet => {
      const cameledJobsheet = dbToRes(jobsheet);
      const components = await Components.findBy({ jobsheet_id: jobsheet.id });

      cameledJobsheet.components = components.map(component => dbToRes(component));
      return cameledJobsheet;
    }))

    res.status(200).json(assigned);
  } catch (error) {
    return res.status(500).json({ error: error.message, step: '/assigned-getcomponents' });
  }

});

module.exports = router;