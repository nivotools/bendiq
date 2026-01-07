import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Debug: Check if env variables are loaded
console.log('Firebase config status:', {
  hasApiKey: !!firebaseConfig.apiKey,
  hasAuthDomain: !!firebaseConfig.authDomain,
  hasProjectId: !!firebaseConfig.projectId,
});

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let firebaseError: string | null = null;

// Check if required config is present
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  firebaseError = 'Firebase configuration missing. Please check environment variables.';
  console.error('Firebase config error:', firebaseError);
} else {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    setPersistence(auth, browserLocalPersistence);
    console.log('Firebase initialized successfully');
  } catch (error: any) {
    firebaseError = error?.message || 'Failed to initialize Firebase';
    console.error('Firebase init error:', firebaseError);
  }
}

export { auth, firebaseError };
export default app;
