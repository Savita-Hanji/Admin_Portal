import admin from "firebase-admin";

// Initialize Firebase Admin SDK
// Provide FIREBASE_SERVICE_ACCOUNT as a JSON string in env, or set GOOGLE_APPLICATION_CREDENTIALS
try {
  let serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT || null;
  if (serviceAccount) {
    // If stored as JSON string, parse it
    serviceAccount = JSON.parse(serviceAccount);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    // Fall back to default application credentials if available
    admin.initializeApp();
  }
  console.log("Firebase Admin initialized");
} catch (err) {
  console.error("Failed to initialize Firebase Admin:", err.message);
}

export default admin;
