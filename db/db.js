require('dotenv').config();
var admin = require("firebase-admin");

var serviceAccount = require("/etc/secrets/theeventssite-firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL
});

const db = admin.database();

module.exports = db;
