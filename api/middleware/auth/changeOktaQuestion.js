const axios = require('axios');

module.exports = (req, res, next) => {
    const { newPassword, newQuestion, newAnswer } = req.body;
    const header = {
        headers: {
            Authorization: `SSWS ${process.env.OKTA_REGISTER_TOKEN}`
        }
    }
    const questionInfo = {
        password: { value: newPassword },
        recovery_question: {
            question: newQuestion,
            answer: newAnswer
        }
    }
    //this url will be different.
    //make an api call to change security question and answer
    axios
    .post(`https://dev-833124.okta.com/api/v1/users/${req.token.id}/credentials/change_recovery_question`, questionInfo, header)
    .then(() => {
        next();
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err, message: 'Failed to change security question with Okta', step: 'changeOktaQuestion middleware'});
    });
}