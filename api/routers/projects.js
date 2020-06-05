const router = require("express").Router();
const { Projects, Jobsheets, Components } = require("../../data/models");
const checkIfProjectExists = require("../middleware/projects/checkIfProjectExists");
const checkBodyForAssigned = require("../middleware/projects/checkBodyForAssigned");
const completeJobsheet = require("../middleware/projects/completeJobsheet");
const dbToRes = require("../../utils/dbToRes");
const roleIdAuth = require("../middleware/auth/roleIdAuth");


router.get("/:id/jobsheets", checkIfProjectExists, async (req, res) => {
	const { id } = req.params;
	let jobsheets;
	try {
		jobsheets = await Jobsheets.findBy({ project_id: id });
		jobsheets = jobsheets.map((jobsheet) => dbToRes(jobsheet));
		return res.status(200).json(jobsheets);
	} catch (error) {
		return res
			.status(500)
			.json({ error: error.message, step: "/:id/jobsheets" });
	}

});

router.put("/:id", checkIfProjectExists, async (req, res) => {
	const { id } = req.params;
	try {
		await Projects.update({ id }, req.body);
		return res.status(200).json({ message: "project has been updated" });
	} catch (error) {
		return res.status(500).json({ error: error.message, step: "/:id" });
	}
});

//This endpoint is to assign a technician to a project
//TODO: middleware validation that the user being assigned exists
router.put(
	"/:id/assignuser",
	checkIfProjectExists,
	checkBodyForAssigned,
	roleIdAuth,
	async (req, res) => {
		const { id } = req.params;

		const changes = { status: "assigned", user_email: req.body.email };

		Jobsheets.update({ project_id: id }, changes)
			.then((updatedJob) => {
				res.status(201).json(dbToRes(updatedJob[0]));
			})
			.catch((err) => {
				res.status(404).json({
					error: err.message,
					message: "Unable to make the required changes to the database.",
					step: "/:id/assignuser",
				});
			});
	}
);

module.exports = router;
