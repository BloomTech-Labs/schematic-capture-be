const axios = require('axios');
const generatePassword = require('../../../utils/generatePassword');
const generateToken = require('../../../utils/generateToken');

//send registration to Okta
const header = {
    headers: {
        Authorization: `SSWS ${process.env.OKTA_REGISTER_TOKEN}` //this will be different
    }
}
//generate a password
const password = generatePassword(10);
//generate security question and answer
const answer = generatePassword(10);

module.exports = (req, res, next) => {
    //front-end sends technician email, role, full name as name
    //separate full name into first name and last name
    let [first, ...last] = req.body.name.split(' ');
    last = last.join(' ');
    
    const registerInfo = {
        profile: {
            firstName: first,
            lastName: last,
            email: req.body.email,
            login: req.body.email
        },
        //group id is in url in dashboard when you click on a group.
        groupIds: [ req.groupId ],
        credentials: {
            password : { value: password },
            recovery_question: { question: "Who's a major player in the cowboy scene?", answer: answer }
        }
    }
    //This url will be different
    axios.post(`https://dev-833124.okta.com/api/v1/users?activate=true`, registerInfo, header).then(response => {
        //generate a token that contains the password and security answer
        req.token = generateToken(response.data.id, req.body.roleId, req.body.email);
        req.id = response.data.id;
        next();
    }).catch(err => {
        res.status(500).json({ error: err, message: 'Failed to register new user with Okta.', step: 'registerUserWithOkta middleware' });
    });
}