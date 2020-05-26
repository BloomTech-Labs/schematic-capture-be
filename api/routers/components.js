const router = require('express').Router();
const dbToRes = require('../../utils/dbToRes');
const { Components } = require("../../data/models");

router.put("/:id/update", (req, res) => {
    const id = Number(req.params.id);

    Components.update({ id }, req.body)
        .then(component => res.status(200).json(dbToRes(component[0])))
        .catch(err => res.status(500).json({ error: err.message, step: '/:id/update' }))
});

module.exports = router;