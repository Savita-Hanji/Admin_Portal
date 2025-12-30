# Firebase (Frontend) Notes

- Ensure `Frontend/.env`:
  - `REACT_APP_API_URL` should point to your backend. For local dev use `http://localhost:5000` (not https).
  - Firebase config variables are already present (REACT_APP_FIREBASE_*) — verify they match your Firebase project.

- In Firebase Console -> Authentication -> Sign-in method, enable **Google** (and **Email/Password** if you'd like to use that method).

- OAuth redirect domains should include `http://localhost:3000` (or your frontend origin).

- After signing in with Google in the frontend, the app will obtain a Firebase ID token and POST it to the backend endpoint `/api/auth/firebase`. The backend exchanges that for a server JWT cookie and returns the user.
