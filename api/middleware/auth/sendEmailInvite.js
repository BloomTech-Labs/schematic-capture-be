module.exports = (req, res, next) => {
    //send an email that contains a link to sign-in with the token in the url
    const sgApiKey = process.env.SG_API_KEY;
    const templateId = process.env.SG_TEMPLATE_ID;
    //CANNOT register at any other endpoint. This is how we make sure people were invited
    const registrationUrl = `schematiccapture.com/firstlogin/${req.token}`;
    const config = {
        headers: {
            Authorization: `Bearer ${sgApiKey}`
        }
    };
    const data = {
        personalizations: [
            {
                to: [{ email: req.body.email, name: req.body.name }],
                dynamic_template_data: { registrationUrl, token: req.token }
            }
        ],
        from: {
            email: "invitation@schematiccapture.com",
            name: "Schematic Capture"
        },
        template_id: templateId
    };
    //send email
    axios
    .post("https://api.sendgrid.com/v3/mail/send", data, config)
    .then(() => {
        console.log(`successfully sent invitation to ${req.body.email}`);
        next();
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ 
            error: err, 
            message: 'Failed to send email to user.', 
            step: 'sendEmailInvite middleware'
        });
    });
}