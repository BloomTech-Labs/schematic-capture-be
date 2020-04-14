const router = require("express").Router();
const jwt = require("jsonwebtoken");
const axios = require("axios");

const reqToDb = require("../../utils/reqToDb");
const dbToRes = require("../../utils/dbToRes");
const { Users } = require("../../data/models");
const { generatePassword } = require('../../utils/generatePassword');
const { generateToken } = require('../../utils/generateToken');
const { jwtSecret } = require('../../utils/secrets');
const roleToRoleId = require('../middleware/users/roleToRoleId');

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
    .then(response => {
        //get user from database via email
        return user.findBy(response._embedded.user.profile.login);
    })
    .then(user => {
        res.status(200).json(user.data);
    })
    .catch(err => {
        res.status(500).json({error: err, message: 'Login with Okta failed.', step: 'api/auth/login'});
    });
});

//register user with email invite
router.post('/invite', roleToRoleId, (req, res) => {
  //front-end sends technician email, role, full name as name
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
          Authorization: `SSWS ${process.env.OKTA_REGISTER_TOKEN}` //this will be different
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
      .then(() => {
        console.log(`successfully sent invitation to ${email}`)
        const data = {
          id: response.data.id,
          role_id: req.body.roleId,
          email: req.body.email,
          first_name: first,
          last_name: last,
          question: "Who's a major player in the cowboy scene?"
        }
        users.add(data).then(addedUser => {
          res.status(201).json({ user: addedUser });
        }).catch(err => {
          res.status(500).json({ 
            error: err, 
            message: 'Failed to add user to Schematic Capture database.', 
            step: 'api/auth/invite'
          });
        })
      })
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

router.post('/changepasswordandquestion', (req, res) => {
  //front-end will send
      //1 new password
      //2 new security question and answer
      //3 token from url
  const { newPassword, newQuestion, newAnswer } = req.body;
  //decode token
  let token;
  jwt.verify(req.body.token, jwtSecret, (err, decodedToken) => {
      if (err) {
          res.status(401).json({ message: 'Invalid token' });
      } else {
          token = decodedToken;
      }
  });
  //make an api call to change password
  const header = {
      headers: {
          Authorization: `SSWS ${process.env.OKTA_REGISTER_TOKEN}`
      }
  }
  const passwordInfo = {
      oldPassword: token.password,
      newPassword: newPassword
  }
  const questionInfo = {
      password: { value: newPassword },
      recovery_question: {
          question: newQuestion,
          answer: newAnswer
      }
  }
  const loginInfo = {
      username: token.email,
      password: newPassword,
      options: {
          multiOptionalFactorEnroll: true,
          warnBeforePasswordExpired: true
      }
  }
  //this url will be different.
  axios
  .post(`https://dev-833124.okta.com/api/v1/users/${token.id}/credentials/change_password`, passwordInfo, header)
  .then(response => {
      //make an api call to change security question and answer
      return axios
      .post(`https://dev-833124.okta.com/api/v1/users/${token.id}/credentials/change_recovery_question`, questionInfo, header)
  })
  .then(response => {
      //log user in
      return axios.post(`https://dev-833124.okta.com/api/v1/authn`, loginInfo)
  })
  .then(response => {
      users.update(token.id, { question: newQuestion }).then(() => {
        res.status(200).json(response.data);
      }).catch(err => {
        res.status(400).json({ 
          error: err, 
          message: 'Failed to change security question in Schematic Capture database.', 
          step: 'api/auth/changepassword'});
      })
  })
  .catch(err => {
      console.log(err);
      res.status(500).json({error: err, message: 'Failed to change password and security question.', step: 'api/auth/changepassword'});
  });
});

//need some way of retrieving security question
router.get('/securityquestion/:id', (req, res) => {
  //get security question from db and send to front-end
  users.getQuestion(req.params.id)
  .then(question => {
      if (Object.keys(question).length === 0) { //No question found
          res.status(400).json({ errorMessage: 'No security question was found for the user.', step: 'api/auth/securityquestion/:id'});
      } else {
          res.status(200).json(question);
      }
  })
  .catch(err => {
      res.status(500).json({error: err, message: 'Couldn\'t get security question', step: 'api/auth/securityquestion/:id'});
  })
});

router.post('/forgotpassword', (req, res) => {
  //front end must send password (new password), answer to the security question and the useId (okta user id)
  const data = {
      password: { value: req.body.password },
      recovery_question: { answer: req.body.answer}
  }
  const header = {
      headers: {
          Authorization: `SSWS ${process.env.OKTA_REGISTER_TOKEN}`
      }
  }
  //this url will be different
  axios
  .post(
      `https://dev-833124.okta.com/api/v1/users/${req.body.userId}/credentials/forgot_password?sendEmail=false`,
      data, 
      header)
  .then(response => {
      res.status(200).json(response.data);
  })
  .catch(err => {
      res.status(500).json({error: err, message: 'Couldn\'t reset the password with Okta.', step: 'api/auth/forgotpassword'});
  })
});

//returns an array of security questions
router.get('/questions', (req, res) => {
  //this url will be different
  axios
  .get('https://dev-833124.okta.com/api/v1/users/00u4syc0frXBxcDtF4x6/factors/questions')
  .then(response => {
      res.status(200).json(response.data);
  })
  .catch(err => {
      res.status(500).json({error: err, message: 'Couldn\'t get recovery questions from Okta.', step: 'api/auth/questions'});
  })
});

module.exports = router;
