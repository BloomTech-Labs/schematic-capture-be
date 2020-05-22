const jwt = require("jsonwebtoken");
const axios = require("axios");
const { jwtSecret } = require("../../../utils/secrets");

module.exports = (req, res, next) => {
	const { newPassword } = req.body;
	//decode token
	jwt.verify(req.body.token, jwtSecret, (err, decodedToken) => {
		if (err) {
			res.status(401).json({ message: "Invalid token" });
		} else {
			req.token = decodedToken;
		}
	});
	// req.token = jwt.decode(req.body.token);
	//make an api call to change password
	const header = {
		headers: { Authorization: `SSWS ${process.env.OKTA_REGISTER_TOKEN}` },
	};
	const passwordInfo = {
		oldPassword: req.token.password,
		newPassword: newPassword,
	};
	//this url will be different.
	axios
		.post(
			`https://dev-833124.okta.com/api/v1/users/${req.token.id}/credentials/change_password`,
			passwordInfo,
			header
		)
		.then(() => next())
		.catch((err) => {
			res
				.status(500)
				.json({
					error: err,
					message: "Failed to change password with Okta",
					step: "changeOktaPassword middleware",
				});
		});
};
