const router = require("express").Router();
const { Roles } = require("../../data/models");
const validateIdToken = require("../middleware/auth/validateIdToken");
const superRoleIdAuth = require("../middleware/auth/superRoleIdAuth");

router.get("/", validateIdToken, superRoleIdAuth, (req, res) => {
	Roles.find()
		.then((roles) => res.status(200).json(roles))
		.catch((error) =>
			res.status(500).json({ error: error.message, step: "api/roles" })
		);
});

module.exports = router;
