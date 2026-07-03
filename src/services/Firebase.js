// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAx2bt67l2YmTUC6rCdbtoLRRnlVTQ7DzQ",
  authDomain: "recicla-que-pontua-pi2026.firebaseapp.com",
  projectId: "recicla-que-pontua-pi2026",
  storageBucket: "recicla-que-pontua-pi2026.firebasestorage.app",
  messagingSenderId: "810991445176",
  appId: "1:810991445176:web:5bffac86f9efae4e1b004d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);