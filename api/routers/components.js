const router = require("express").Router();
const reqToDb = require("../../utils/reqToDb");
const dbToRes = require("../../utils/dbToRes");
const updateJobsheetCompleted = require("../../utils/updateJobsheetCompleted");
const { Components } = require("../../data/models");

router.put("/:id/update", (req, res) => {
	const id = Number(req.params.id);
	console.log(req.body);
	const component = reqToDb(req.body);

	Components.update({ id }, component)
		.then((component) => {
			if (req.body.image || req.body.image == null) {
				updateJobsheetCompleted(component[0].id)
			  }
			res.status(200).json(dbToRes(component[0]))
		
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: err.message, step: "/:id/update" });
		});
});

module.exports = router;
