const jwt = require("jsonwebtoken");
const { jwtSecret } = require("./secrets");

module.exports = (id, roleId, email, password = null) => {
	const payload = {
		id,
		roleId,
		email,
	};
	if (password) payload.password = password;
	const options = {
		//Talk with team and change to concensus expiration time.
		expiresIn: "24h",
	};
	return jwt.sign(payload, jwtSecret, options);
};
