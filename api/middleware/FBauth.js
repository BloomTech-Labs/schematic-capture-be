const { admin, firebase } = require('../../utils/firebase');
const db = require('../../data/dbConfig');

module.exports = (req, res, next) => {
    let idToken;
    if (
        req.headers.authorization
        && req.headers.authorization.startsWith('Auth ')
    ) {
        idToken = req.headers.authorization.split('Auth ')[1];
    } else {
        console.error('No token found');
        return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = firebase.auth().currentUser;

    admin
        .auth()
        .verifyIdToken(idToken)
        .then((decodedToken) => {
            let uid = decodedToken.uid;
            // console.log(uid);
            // console.log(user.uid);
            if(uid === user.uid){
                console.log("you did it");
                next()
            }
        })
        .catch((error) => {
            console.error('Error while verifying token ', error);
            return res.status(403).json({error: "I'm here.."});
        });
};