const { firebase } = require("../../../utils/firebase");

module.exports = async (req, res, next) => {

    if (process.env.DB_ENV === 'development') {
        const { email, password } = req.body;
        await firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(data => {
            return data.user.getIdToken();
            })
            .then(idToken => {
            console.log('this is the idToken: \n', idToken);
            req.headers.authorization = `Bearer ${idToken}`;
            next();
            })
            .catch(error => console.log(error));
    }

}