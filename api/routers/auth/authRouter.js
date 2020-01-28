const { firebase } = require("../../../utils");
const { userModel } = require("../../../data/models");
const router = require("express").Router();

router.post("/register", (req, res) => {
    const { email, password, first_name, last_name, phone } = req.body;

    let uid;

    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(data => {
            uid = data.user.uid;

            return data.user.getIdToken();
        })
        .then(token => {
            return userModel
                .add({
                    email,
                    first_name,
                    last_name,
                    phone,
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

module.exports = router;
