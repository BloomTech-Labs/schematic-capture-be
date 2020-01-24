const firebase = require("firebase");

const config = {
    apiKey: "AIzaSyCoCWGv8gUwxDG6Ayw4V852YaxCULFpkqM",
    authDomain: "schematic-capture.firebaseapp.com",
    databaseURL: "https://schematic-capture.firebaseio.com",
    projectId: "schematic-capture",
    storageBucket: "schematic-capture.appspot.com",
    messagingSenderId: "138524710398",
    appId: "1:138524710398:web:4ebe7a4ea0f4af40da1caf",
    measurementId: "G-JRCEKEEK2Q"
};

firebase.initializeApp(config);

module.exports = firebase;
