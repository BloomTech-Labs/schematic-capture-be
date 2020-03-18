const router = require("express").Router();
const { Roles } = require("../../data/models");

router.get("/", (req, res) => {
  Roles.find()
    .then(roles => res.status(200).json(roles))
    .catch(error => res.status(500).json({ error: error.message }));
});

module.exports = router;