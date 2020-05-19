const router = require("express").Router();
const axios = require("axios");
const { Users } = require("../../data/models");
const validateRegistration = require('../middleware/auth/validateRegistration');
const roleToRoleId = require('../middleware/users/roleToRoleId');
const registerUserWithOkta = require('../middleware/auth/registerUserWithOkta');
const sendEmailInvite = require('../middleware/auth/sendEmailInvite');
const changeOktaPassword = require('../middleware/auth/changeOktaPassword');
const changeOktaQuestion = require('../middleware/auth/changeOktaQuestion');
const getIdByEmail = require('../middleware/users/getIdByEmail');
const generateToken = require('../../utils/generateToken');
const dbToRes = require('../../utils/dbToRes');

//TESTED
router.post('/login', (req, res) => {
    if (!req.body) {
        res.status(400).json({ message: "Missing post data. Ensure you sent the user's login information." });
    } else if (!req.body.username || !req.body.password) {
        res.status(400).json({ message: "Incomplete user data. Please include the user's username and password" });
    }
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
      Users.findBy({ email: response.data._embedded.user.profile.login })
      .then(user => {
        const token = generateToken(user.id, user.role.id, user.email );
        user.token = token;
        res.status(200).json(dbToRes(user));
      });
    })
    .catch(err => {
        res.status(500).json({error: err, message: 'Login with Okta failed.', step: 'api/auth/login'});
    });
});

//register user with email invite
//TESTED - except adding to database
router.post('/invite', validateRegistration, roleToRoleId, registerUserWithOkta, sendEmailInvite, (req, res) => {
  //front-end sends technician email, role, full name as name
  //separate full name into first name and last name
  let [first, ...last] = req.body.name.split(' ');
  last = last.join(' ');
  const data = {
    id: req.id,
    role_id: parseInt(req.body.roleId),
    email: req.body.email,
    first_name: first,
    last_name: last,
    question: "Who's a major player in the cowboy scene?"
  }
  //add user to database
  Users.add(data).then(addedUser => {
    res.status(201).json({ user: dbToRes(addedUser) });
  }).catch(err => {
    res.status(500).json({ 
      error: err, 
      message: 'Failed to add user to Schematic Capture database.', 
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

//TESTED - except updating user in database
router.post('/firstlogin', changeOktaPassword, changeOktaQuestion, (req, res) => {
  //front-end will send
      //1 new password
      //2 new security question and answer
      //3 token from url
  const { newPassword, newQuestion } = req.body;
  const loginInfo = {
      username: req.token.email,
      password: newPassword,
      options: {
          multiOptionalFactorEnroll: true,
          warnBeforePasswordExpired: true
      }
  }
  //this url will be different.
  //log user in
  axios.post(`https://dev-833124.okta.com/api/v1/authn`, loginInfo)
  .then(response => {
    //update user in database
    Users.update({ id: req.token.id }, { question: newQuestion }).then(() => {
      const token = generateToken(req.token.id, req.token.roleId, req.token.email);
      response.data.token = token;
      res.status(200).json(response.data);
    }).catch(err => {
      res.status(400).json({ 
        error: err, 
        message: 'Failed to change security question in Schematic Capture database.', 
        step: 'api/auth/firslogin'});
    })
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err, 
      message: 'Failed to log user in after changing password and security question.', 
      step: 'api/auth/changepassword'
    });
  });
});

//need some way of retrieving security question
//TESTED
router.get('/securityquestion/:id', (req, res) => {
  //get security question from db and send to front-end
  Users.getQuestion(req.params.id)
  .then(question => {
      if (question.question === null) { //No question found
          res.status(400).json({ errorMessage: 'No security question was found for the user.', step: 'api/auth/securityquestion/:id'});
      } else {
          res.status(200).json(question);
      }
  })
  .catch(err => {
      res.status(500).json({error: err, message: 'Couldn\'t get security question', step: 'api/auth/securityquestion/:id'});
  })
});

//TESTED
router.post('/forgotpassword', getIdByEmail, (req, res) => {
  //front end must send password (new password), answer to the security question
  //get userId through email? middleware?
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
      //log user in?
      res.status(200).json(response.data);
  })
  .catch(err => {
      res.status(500).json({error: err, message: 'Couldn\'t reset the password with Okta.', step: 'api/auth/forgotpassword'});
  })
});

//returns an array of security questions
//TESTED
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

//register user WITHOUT email invite
//ONLY USE FOR DEVELOPMENT!!!
router.post('/register', roleToRoleId, (req, res) => {
  //send the user's name, email, role, password
  let [first, ...last] = req.body.name.split(' ');
  last = last.join(' ');
  const header = {
      headers: {
          Authorization: `SSWS ${process.env.OKTA_REGISTER_TOKEN}`
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
          req.groupId
      ],
      credentials: {
          password : { value: req.body.password },
          recovery_question: {
              question: "Who's a major player in the cowboy scene?",
              answer: "Annie Oakley"
          }
      }
  }

  axios
  .post(`https://dev-833124.okta.com/api/v1/users?activate=true`, registerInfo, header)
  .then(response => {
      console.log(response);
      //Add user to database.
      const data = {
        id: response.id,
        role_id: req.body.roleId,
        email: req.body.email,
        first_name: first,
        last_name: last,
        question: "Who's a major player in the cowboy scene?"
      }
      //add user to database
      return Users.add(data).then(addedUser => {
        const token = generateToken(addedUser.id, addedUser.role.id, data.email, );
        addedUser.token = token;
        res.status(201).json({ user: dbToRes(addedUser) });
      })
  })
  .catch(err => {
      console.log(err);
      res.status(500).json({error: err, message: 'Registration with Okta failed.', step: 'api/auth/resgister'});
  });
});

module.exports = router;
