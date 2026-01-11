import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD130ywuRLY_d5NGPnQzcs03Se9pM7BwGw",
  authDomain: "bendiq-f2b42.firebaseapp.com",
  projectId: "bendiq-f2b42",
  storageBucket: "bendiq-f2b42.firebasestorage.app",
  messagingSenderId: "1099283225918",
  appId: "1:1099283225918:web:a1ee218f60dd1fedac206f",
  measurementId: "G-5CZ48RBR84",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
