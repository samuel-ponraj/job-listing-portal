// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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