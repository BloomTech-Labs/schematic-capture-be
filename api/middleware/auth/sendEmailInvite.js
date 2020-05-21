const axios = require("axios");

const config = {
	headers: { Authorization: `Bearer ${process.env.SG_API_KEY}` },
};

module.exports = (req, res, next) => {
	//send an email that contains a link to sign-in with the token in the url
	//CANNOT register at any other endpoint. This is how we make sure people were invited
	//this method of attaching token to the url should be eventually changed.
	const registrationUrl = `https://schematiccapture.com/firstlogin/${req.token}`;
	const data = {
		personalizations: [
			{
				to: [{ email: req.body.email, name: req.body.name }],
				dynamic_template_data: { registrationUrl, token: req.token },
			},
		],
		from: {
			email: "invitation@schematiccapture.com",
			name: "Schematic Capture",
		},
		template_id: process.env.SG_TEMPLATE_ID,
	};
	//send email
	axios
		.post("https://api.sendgrid.com/v3/mail/send", data, config)
		.then(() => next())
		.catch((error) => {
			res.status(500).json({
				error: error,
				message: "Failed to send email to user.",
				step: "sendEmailInvite middleware",
			});
		});
};
