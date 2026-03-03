var firebase = require('firebase')
// datos de firebase
var config = {

  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

const fire = firebase.initializeApp(config);
module.exports = fire;