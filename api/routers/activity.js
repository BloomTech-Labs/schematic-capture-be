const router = require("express").Router();
const reqToDb = require("../../utils/reqToDb");
const dbToRes = require("../../utils/dbToRes");
const superRoleIdAuth = require("../middleware/auth/superRoleIdAuth");
const { Activity } = require("../../data/models");

router.get('/', superRoleIdAuth ,async (req, res) => {

  let limitVal = req.query.limit || 20
    
  
    Activity
      .find().orderBy("id","desc").limit(limitVal)
      .then(components => res.status(200).json(components.map(component => dbToRes(component))))
      .catch(error => res.status(500).json({ error: error.message, step: '/:activity' }));
  });

module.exports = router;
