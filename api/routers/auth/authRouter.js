const { firebase, config } = require('../../../utils/firebase');
const { userModel } = require("../../../data/models");
const { firebase } = require("../../../utils");
const { Users } = require("../../../data/models");
const router = require("express").Router();
const FBauth = require('../../middleware/FBauth');

firebase.initializeApp(config);

const { validateSignupData, validateLoginData, reduceUserDetails } = require('../../middleware/validation');

router.post("/register", (req, res) => {
    const { email, password, first_name, last_name, phone } = req.body;

    let uid;
    const newUser = {   email: req.body.email,
                        password: req.body.password,
                        confirmPassword: req.body.confirmPassword,
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        phone: req.body.phone
    };

    const { valid, errors } = validateSignupData(newUser);
    if(!valid) return res.status(400).json(errors);

    firebase
        .auth()
        .createUserWithEmailAndPassword(newUser.email, newUser.password)
        .then(data => {
            uid = data.user.uid;

            return data.user.getIdToken();
        })
        .then(token => {
            return Users
                .add({
                    email: newUser.email,
                    first_name: newUser.first_name,
                    last_name: newUser.last_name,
                    phone: newUser.phone,
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

    const { valid, errors } = validateLoginData(req.body);
    if(!valid) return res.status(400).json(errors);

    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(data => {
            uid = data.user.uid;
            return data.user.getIdToken();
        })
        .then(token => {
            return Users.findBy({ id: uid })
                .then(user => {
                    return res.status(200).json({ user, token });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => {
            if(error.code === 'auth/wrong-password'){
                return res
                    .status(403)
                    .json({general: "Incorrect Username/Password combination. Please try again."})
            } else if(error.code === 'auth/user-not-found'){
                return res
                    .status(403)
                    .json({general: "User not found in system"})
            } else if(error.code === 'auth/invalid-email'){
                return res
                    .status(403)
                    .json({general: "Invalid Email input."})
            } else {
                console.log(error);
                return res
                    .status(500)
                    .json({error: error.code})
            }
        })
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
