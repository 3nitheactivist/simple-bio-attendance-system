import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwKsocHp8vrmCi0kNRS8KW2kniiuRB2Jo",
  authDomain: "simple-bio-attendance-system.firebaseapp.com",
  projectId: "simple-bio-attendance-system",
  storageBucket: "simple-bio-attendance-system.firebasestorage.app",
  messagingSenderId: "889516896189",
  appId: "1:889516896189:web:936f056a55ce4215582cd4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore (Database)
const db = getFirestore(app);

export { db };