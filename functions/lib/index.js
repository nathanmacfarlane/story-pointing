"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require('firebase-admin');
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
admin.initializeApp();
exports.cleanupRooms = functions.firestore
    .document('Rooms/{roomId}')
    .onCreate((snap, context) => {
    const deleteBeforeThisDate = new Date(Date.now() - 12096e5);
    const db = admin.firestore();
    db.collection('Rooms')
        .where('timestamp', '<', deleteBeforeThisDate)
        .get()
        .then((snapshot) => {
        snapshot.forEach((doc) => {
            console.log(doc.data());
        });
    });
});
//# sourceMappingURL=index.js.map