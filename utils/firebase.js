require("dotenv").config();
const firebase = require("firebase");
const admin = require("firebase-admin");
const serviceAccount = require("../admin-key");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://schematic-capture.firebaseio.com"
});

const config = {
    apiKey: process.env.FB_KEY,
    authDomain: process.env.FB_AUTH_DOMAIN,
    databaseURL: process.env.FB_DB_URL,
    projectId: process.env.FB_PROJECT_ID,
    storageBucket: process.env.FB_STORAGE_BUCKET,
    messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
    appId: process.env.FB_APP_ID,
    measurementId: process.env.FB_MEASUREMENT_ID
};

const db = admin.firestore();

module.exports = { firebase, db, admin, config };
