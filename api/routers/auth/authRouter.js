const { firebase, config } = require('../../../utils/firebase');
const { userModel } = require("../../../data/models");
const router = require("express").Router();
const FBauth = require('../../middleware/FBauth');

firebase.initializeApp(config);

const { validateSignupData, validateLoginData, reduceUserDetails } = require('../../middleware/validation');

router.post("/register", (req, res) => {
    let uid;
    const newUser = {   email: req.body.email,
                        password: req.body.password,
                        confirmPassword: req.body.confirmPassword,
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        phone: req.body.phone
    };

    const { valid, error } = validateSignupData(newUser);
    if(!valid) return res.status(400).json({error: "There has been an error"});

    firebase
        .auth()
        .createUserWithEmailAndPassword(newUser.email, newUser.password)
        .then(data => {
            uid = data.user.uid;

            return data.user.getIdToken();
        })
        .then(token => {
            return userModel
                .add({
                    ...newUser,
                    id: uid,
                    organization_id: 1,
                    role_id: 2
                })
                .then(user => {
                    return res.status(201).json({ user, token });
                })
                .catch(error => {
                    // TODO add firebase cleanup on unsuccessful insert to the database.
                    res.status(500).json({ error: error.message });
                });
        })
        .catch(error => res.status(500).json({ error: error.message }));
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    let uid;

    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(data => {
            uid = data.user.uid;
            return data.user.getIdToken();
        })
        .then(token => {
            return userModel
                .findBy({ id: uid })
                .then(user => {
                    return res.status(200).json({ user, token });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
});

router.post("/forgotPassword", FBauth, (req, res) => {
   const { email } = req.body;
   const auth = firebase.auth();

   auth
       .sendPasswordResetEmail(email)
       .then(() => {
           return res.status(200).json({success: "Please check your inbox for the password reset e-mail."})
       })
       .catch(error => {
           console.log(error);
           return res.status(500).json({error})
       })
});

router.post('/changeEmail', FBauth, (req, res) => {
   const { newEmail } = req.body;
   const user = firebase.auth().currentUser;

   user
       .updateEmail(newEmail)
       .then(() => {
           return res.status(200).json({success: `Your email address has been changed to ${newEmail}`})
       })
       .catch( error => {
           console.log(error);
           res.status(500).json({error: "Unable to update email address."})
       })
});

module.exports = router;
