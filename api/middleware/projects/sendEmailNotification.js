const axios = require("axios");

const config = {
	headers: { Authorization: `Bearer ${process.env.SG_API_KEY}` },
};

module.exports = (req, res, next) => {
	//send an email that contains a link to sign-in with the token in the url
	//CANNOT register at any other endpoint. This is how we make sure people were invited
	//this method of attaching token to the url should be eventually changed.
	const customUrl = `master.d3bnlq4xzoa0gr.amplifyapp.com/project/${req.params.id}`;
	const data = {
		personalizations: [
			{
				to: [{ email: req.body.email}],
				dynamic_template_data: { customUrl},
			},
		],
		from: {
			email: "invitation@schematiccapture.com",
			name: "Schematic Capture",
		},
		template_id: process.env.SG_TEMPLATE_ID2,
	};
	//send email
	axios
		.post("https://api.sendgrid.com/v3/mail/send", data, config)
		.then(() => next())
		.catch((error) => {
			res.status(500).json({
				error: error,
				message: "Failed to send notification email to user.",
				step: "sendEmailNotification middleware",
			});
		});
};
