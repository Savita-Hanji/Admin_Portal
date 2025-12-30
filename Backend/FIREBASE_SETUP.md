# Firebase Admin Setup

1. Create a Firebase project and generate a Service Account JSON file in the Firebase Console (Project Settings -> Service Accounts -> Generate new private key).
2. Add the service account JSON to your `Backend` environment. You can either:
    - Set an environment variable named `FIREBASE_SERVICE_ACCOUNT` containing the JSON (stringify the JSON); or
    - Set `GOOGLE_APPLICATION_CREDENTIALS` to point to the service account JSON file path.
3. Install dependency in backend: `npm install firebase-admin` (or run `npm i` after `package.json` updated).
4. Restart backend server (e.g., `npm run dev`).

Notes:

-   Make sure `REACT_APP_API_URL` in `Frontend/.env` is set to `http://localhost:5000` (if running locally).
-   In Firebase Console -> Authentication -> Sign-in method, enable Google sign-in (and Email/Password if you plan to use it).
-   Add `http://localhost:3000` (or your frontend origin) to OAuth redirect domains in Firebase Console.
