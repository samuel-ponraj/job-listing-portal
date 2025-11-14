
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyADdbjPx0SvvUguWnKROOpsbPP1v705VDU",
  authDomain: "job-listing-portal-b2acd.firebaseapp.com",
  projectId: "job-listing-portal-b2acd",
  storageBucket: "job-listing-portal-b2acd.firebasestorage.app",
  messagingSenderId: "80828503686",
  appId: "1:80828503686:web:8acb9b8e9e116e495a2307"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);