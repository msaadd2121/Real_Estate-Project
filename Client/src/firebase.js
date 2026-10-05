// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-realstate-f0565.firebaseapp.com",
  projectId: "mern-realstate-f0565",
  storageBucket: "mern-realstate-f0565.firebasestorage.app",
  messagingSenderId: "38164173569",
  appId: "1:38164173569:web:db63bef8257eb656780100"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);