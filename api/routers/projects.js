const router = require("express").Router();
const { Projects, Jobsheets, Components } = require("../../data/models");
const getUserInfo = require("../middleware/users/getUserInfo");
const checkIfProjectExists = require("../middleware/projects/checkIfProjectExists")
const checkBodyForAssigned = require("../middleware/projects/checkBodyForAssigned")


router.get("/:id/jobsheets", checkIfProjectExists, async (req, res) => {
    const { id } = req.params;

    let project;

    try {
        project = await Projects.findBy({ id }).first();

        if (!project) {
            return res
                .status(404)
                .json({ error: "project with this id does not exists" });
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

    router.put("/:id", checkIfProjectExists, async (req, res) => {
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

router.put('/:id/jobsheets', checkIfProjectExists, checkBodyForAssigned, async (req, res) => {
    const { id } = req.params

    Jobsheets.update({ project_id: id}, req.body)
    .then(updatedJob => {
        res.status(201).json(updatedJob)
    })
    .catch(err => {
        err.status(404)
        .json({ error: error.message, step: "/:id/jobsheets" })
    })
})

module.exports = router;
