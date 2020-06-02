const router = require("express").Router();
const { Users } = require("../../data/models");
const dbToRes = require("../../utils/dbToRes");
const validateIdToken = require("../middleware/auth/validateIdToken");
const superRoleIdAuth = require("../middleware/auth/superRoleIdAuth");

router.get("/available", validateIdToken, superRoleIdAuth, (req, res) => {
    Users.find()
        .where ('role_Id', 2)
        .where ('status', 'Unassigned')
		.then((users) => {
            users = users.map((user) => dbToRes(user));
			res.status(200).json(users);
		})
		.catch((err) => {
			res
				.status(500)
				.json({
					error: err,
					message: "Couldn't get available technicians",
					step: "api/users/availableTechs/",
				});
		});
});

//TODO: Complete this endpoint to return projects/jobsheets/components that have been assigned to the current user only.

module.exports = router;
