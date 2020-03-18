const router = require("express").Router();
const dbToRes = require("../../utils/dbToRes");
const reqToDb = require("../../utils/reqToDb");
const { Projects, Jobsheets, Components } = require("../../data/models");
const getUserInfo = require('../middleware/users/getUserInfo');
const getUserOrganizations = require("../middleware/users/getUserOrganizations");

router.get("/:id/jobsheets", getUserOrganizations, async (req, res) => {
    const { id } = req.params;

    let project;

    try {
        project = await Projects.findBy({ id }).first();

        if (!project) {
            return res
                .status(404)
                .json({ error: "project with this id does not exists" });
        }

        if (!req.userOrganizations.includes(project.client_id)) {
            return res.status(403).json({
                error:
                    "project is not associated with a client that belongs to the user"
            });
        }
    } catch (error) {
        return res
            .status(500)
            .json({ error: error.message, step: "/:id/jobsheets" });
    }

    let jobsheets;

    try {
        jobsheets = await Jobsheets.findBy({ project_id: id });
        return res.status(200).json(jobsheets);
    } catch (error) {
        return res
            .status(500)
            .json({ error: error.message, step: "/:id/jobsheets" });
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;

    let project;

    try {
        project = await Projects.findBy({ id }).first();

        if (!project) {
            return res
                .status(404)
                .json({ error: "project with this id does not exist" });
        }

        await Projects.update({ id }, req.body);
        return res.status(200).json({ message: "project has been updated" });
    } catch (error) {
        return res
            .status(500)
            .json({ error: error.message, step: "/:id/jobsheets" });
    }
});

module.exports = router;
