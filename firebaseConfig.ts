// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB2sXMt9TinVwhD87glN_enwSBzcAWVaKI",
  authDomain: "menasa-saas.firebaseapp.com",
  projectId: "menasa-saas",
  storageBucket: "menasa-saas.appspot.com",
  messagingSenderId: "117091956032",
  appId: "1:117091956032:web:85bb227ef6330d502f76a5",
  measurementId: "G-GVM8JRC2CR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
