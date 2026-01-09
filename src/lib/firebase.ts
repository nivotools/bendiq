import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDTA1sJ0rurDW90E0f_5epq2EiatjVTtjw",
  authDomain: "bendiq-62c65.firebaseapp.com",
  projectId: "bendiq-62c65",
  storageBucket: "bendiq-62c65.firebasestorage.app",
  messagingSenderId: "985415651642",
  appId: "1:985415651642:web:314781bf40cadc25aa8003",
  measurementId: "G-TYH856479C"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
