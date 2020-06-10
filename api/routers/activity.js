const router = require("express").Router();
const reqToDb = require("../../utils/reqToDb");
const dbToRes = require("../../utils/dbToRes");
const { Activity } = require("../../data/models");

router.get('/', async (req, res) => {
  
    Activity
      .find()
      .then(components => res.status(200).json(components.map(component => dbToRes(component))))
      .catch(error => res.status(500).json({ error: error.message, step: '/:activity' }));
  });

module.exports = router;
