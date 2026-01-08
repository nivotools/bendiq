import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDTA1sJ0rurDW90E0f_5epq2EiatjVTtjw",
  authDomain: "bendiq-62c65.firebaseapp.com",
  projectId: "bendiq-62c65",
  storageBucket: "bendiq-62c65.firebasestorage.app",
  messagingSenderId: "985415651642",
  appId: "1:985415651642:web:314781bf40cadc25aa8003"
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
