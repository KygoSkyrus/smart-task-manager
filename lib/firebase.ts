import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAM8gF-So83UmCX7po4MnqjP1ZaJr2y0o8",
  authDomain: "task-manager-dg.firebaseapp.com",
  projectId: "task-manager-dg",
  storageBucket: "task-manager-dg.appspot.com",
  messagingSenderId: "261924715327",
  appId: "1:261924715327:web:d9946047b4c2a49cc6f18a",
  measurementId: "G-558T0Q1L78"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
