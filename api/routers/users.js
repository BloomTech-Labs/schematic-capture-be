const router = require("express").Router();
const { Users } = require("../../data/models");
const dbToRes = require("../../utils/dbToRes");
const validateIdToken = require("../middleware/auth/validateIdToken");
const superRoleIdAuth = require("../middleware/auth/superRoleIdAuth");

router.get("/", validateIdToken, superRoleIdAuth, (req, res) => {
	Users.find()
		.then((users) => {
			users = users.map((user) => dbToRes(user));
			res.status(200).json(users);
		})
		.catch((err) => {
			res
				.status(500)
				.json({
					error: err,
					message: "Couldn't get users",
					step: "api/users/",
				});
		});
});

router.get("/availableTechs", validateIdToken, superRoleIdAuth, (req, res) => {
	Users.find()
		.where("role_Id", 2)
		.where("status", "Unassigned")
		.then((techs) => {
			techs = techs.map((tech) => dbToRes(tech));
			res.status(200).json(techs);
		})
		.catch((err) => {
			res
				.status(500)
				.json({
					error: err,
					message: "Couldn't get available techs",
					step: "api/users/availableTechs",
				});
		});
})

module.exports = router;
