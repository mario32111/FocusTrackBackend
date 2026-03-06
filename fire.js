const admin = require('firebase-admin');

// Inicializa Firebase Admin con las credenciales del servicio (service account)
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };