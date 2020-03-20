const router = require("express").Router();
const jwt = require("jsonwebtoken");
const axios = require("axios");

const { firebase, admin } = require('../../utils/firebase');
const reqToDb = require("../../utils/reqToDb");
const dbToRes = require("../../utils/dbToRes");
const { Users } = require("../../data/models");

const checkAccountExists = require('../middleware/auth/checkAccountExists');
const validateIdToken = require('../middleware/auth/validateIdToken');
const validateInviteToken = require('../middleware/auth/validateInviteToken');
const validateRegistration = require('../middleware/auth/validateRegistration');
const checkRoleExists = require('../middleware/roles/checkRoleExists');
const emailLogin = require('../middleware/auth/emailLogin');

router.post('/g', (req, res) => { // use to get a test idToken;
  const { email, password } = req.body;
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(async data => {
      const token = await data.user.getIdToken();
      res.status(200).json(token);
    })
    .catch(error => res.status(500).json({ error: error.code, step: '/g' }));
})

router.post('/register', validateIdToken, checkAccountExists(false), validateInviteToken, validateRegistration, (req, res) => {
  Users
    .add(reqToDb(req.userData))
    .then(user => res.status(201).json(dbToRes(user)))
    .catch(async error => {
      if (req.canDeleteFirebaseAccount) {
        const { auth } = admin;
        const { uid } = req.decodedIdToken;
        await auth().deleteUser(uid)
      }
      res.status(500).json({ error: error.message, step: 'register' });
    });
});

router.post("/login", emailLogin, validateIdToken, checkAccountExists(true), async (req, res) => {
  const { email } = req.decodedIdToken;
  console.log('email in login endpoint in auth.js', email);
  Users
    .findBy(email) 
    .then(user => res.status(200).json(dbToRes(user)))
    .catch(error => res.status(500).json({ error: error.message, message: 'There was a problem logging the user in.' }));
});

router.post("/forgotPassword", (req, res) => {
  const { email } = req.body;
  const auth = firebase.auth();

  auth
    .sendPasswordResetEmail(email)
    .then(() => {
      return res.status(200).json({
        success: "Please check your inbox for the password reset e-mail."
      });
    })
    .catch(error => {
      return res.status(500).json({ error });
    });
});

router.post("/changeEmail", validateIdToken, (req, res) => {
  const { newEmail } = req.body;
  const user = firebase.auth().currentUser;

  user
    .updateEmail(newEmail)
    .then(() => {
      return res.status(200).json({
        success: `Your email address has been changed to ${newEmail}`
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "Unable to update email address." });
    });
});

router.post("/invite", validateIdToken, checkRoleExists, async (req, res) => {
  const inviter = await Users.findBy(req.decodedIdToken.email);

  const { roleId, name, email } = req.body;

  const contents = { organizationId: inviter.organizations[0].id, roleId, inviter: inviter.id, time: new Date().getTime() };

  const sgApiKey = process.env.SG_API_KEY;
  const templateId = process.env.SG_TEMPLATE_ID;
  const registrationUrl = process.env.REGISTER_URL;
  const inviteToken = signInvite(contents);

  const config = {
    headers: {
      Authorization: `Bearer ${sgApiKey}`
    }
  };

  const data = {
    personalizations: [
      {
        to: [{ email, name }],
        dynamic_template_data: { registrationUrl, inviteToken }
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
    .then(() =>
      res
        .status(202)
        .json({ message: `successfully sent invitation to ${email}` })
    )
    .catch(error => {
      res.status(500).json({ error: error.message, step: "sendgridInvite" });
    });
});


function signInvite(contents) {
  const secret = process.env.INVITE_SECRET;
  const options = { expiresIn: "1hr" };
  
  return jwt.sign(contents, secret, options);
}

module.exports = router;
