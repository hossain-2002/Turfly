import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCjpsK4sRl3Y6J08n2Jl4DlUNhkTnr-0YU",
  authDomain: "turfly-f6f36.firebaseapp.com",
  projectId: "turfly-f6f36",
  storageBucket: "turfly-f6f36.firebasestorage.app",
  messagingSenderId: "893835921945",
  appId: "1:893835921945:web:02f504bdd0c69bfed1f888"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
