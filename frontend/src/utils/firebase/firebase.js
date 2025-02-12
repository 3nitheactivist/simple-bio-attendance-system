import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3LTF5TeEpYyJXcKh8dFZQFjS3pTkcOY4",
  authDomain: "biometric-attendance-21d85.firebaseapp.com",
  projectId: "biometric-attendance-21d85",
  storageBucket: "biometric-attendance-21d85.firebasestorage.app",
  messagingSenderId: "159871442221",
  appId: "1:159871442221:web:8ec9cbd1bfddde2c8447a4",
  measurementId: "G-4B5EDWNVHM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore (Database)
const db = getFirestore(app);

// Authentication with Persistence
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting persistence:", error);
});

export { db, auth };