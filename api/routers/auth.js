const router = require("express").Router();
const jwt = require("jsonwebtoken");
const axios = require("axios");

const reqToDb = require("../../utils/reqToDb");
const dbToRes = require("../../utils/dbToRes");
const { Users } = require("../../data/models");
const { generatePassword } = require('../../utils/generatePassword');
const { generateToken } = require('../../utils/generateToken');
const { jwtSecret } = require('../../utils/secrets');

router.post('/login', (req, res) => {
    const loginInfo = {
        username: req.body.username,
        password: req.body.password,
        options: {
            multiOptionalFactorEnroll: true,
            warnBeforePasswordExpired: true
        }
    }
    //this url will change when we get our official okta account.
    axios
    .post(`https://dev-833124.okta.com/api/v1/authn`, loginInfo)
    .then(Response => {
        res.status(200).json(Response.data);
    })
    .catch(err => {
        res.status(500).json({error: err, message: 'Login with Okta failed.', step: 'api/auth/login'});
    });
});

//register user with email invite
router.post('/invite', (req, res) => {
  //front-end sends technician email, roleId, full name as name
  //separate full name into first name and last name
  const [first, ...last] = req.body.name.split(' ');
  //convert role id to group id
  let groupId
  switch (req.body.roleId) {
      case 1:
          //These groupIds will be different for SchemCap's groups
          groupId = '00g4ym8nmTwfhWeEm4x6';
          break;
      case 2:
          groupId = '00g4ymzijCXBwLK2h4x6';
          break;
      default:
          groupId = '00g4ym8k0Wc6sGqCW4x6';
          break;
  }
  //generate a password
  const password = generatePassword(8);
  //generate security question and answer
  const answer = generatePassword(10);
  //send registration to Okta
  const header = {
      headers: {
          Authorization: `SSWS ${process.env.OKTA_REGISTER_TOKEN_TEST}` //this will be different
      }
  }
  const registerInfo = {
      profile: {
          firstName: first,
          lastName: last,
          email: req.body.email,
          login: req.body.email
      },
      groupIds: [
          //group id is in url in dashboard when you click on a group.
          groupId
      ],
      credentials: {
          password : { value: password },
          recovery_question: {
              question: "Who's a major player in the cowboy scene?",
              answer: answer
          }
      }
  }
  //This url will be different
  axios
  .post(`https://dev-833124.okta.com/api/v1/users?activate=true`, registerInfo, header)
  .then(response => {
      //generate a token that contains the password and security answer
      const token = generateToken(response.data.id, req.body.roleId, req.body.email, password, answer);
      //send an email that contains a link to sign-in with the token in the url
      const sgApiKey = process.env.SG_API_KEY;
      const templateId = process.env.SG_TEMPLATE_ID;
      //CANNOT register at any other endpoint. This is how we make sure people were invited
      const registrationUrl = `somethinglike.schematiccapture.com/firstregistration/${token}`;
      const config = {
          headers: {
              Authorization: `Bearer ${sgApiKey}`
          }
      };
      const data = {
          personalizations: [
              {
                  to: [{ email: req.body.email, name: req.body.name }],
                  dynamic_template_data: { registrationUrl, token }
              }
          ],
          from: {
              email: "invitation@schematiccapture.com",
              name: "Schematic Capture"
          },
          template_id: templateId
      };
      axios
      .post("https://api.sendgrid.com/v3/mail/send", data, config)
      .then(() => console.log(`successfully sent invitation to ${email}`))
      .catch(error => console.log(error));
      console.log(response);
      res.status(200).json(response.data);
  })
  .catch(err => {
      console.log(err);
      res.status(500).json({ 
          error: err, 
          message: 'Failed to register to new user with Okta.', 
          step: 'api/auth/invite'
      });
  });
      //upon first sign in, user must change password and security question
      //front-end will send
          //1 new password
          //2 new security question and answer
          //3 token from url
  //make an api call to change password and security question
});

module.exports = router;
