// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  // optional: setPersistence, browserLocalPersistence
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBVRoQi7a8e_0b9ErwE6WPzWLqATvMqfQA",
  authDomain: "my-first-mern-app-c93ca.firebaseapp.com",
  projectId: "my-first-mern-app-c93ca",
  // If you didn’t customize storage, default is .appspot.com:
  storageBucket: "my-first-mern-app-c93ca.appspot.com",
  messagingSenderId: "736959316163",
  appId: "1:736959316163:web:9c72795b17b4122dd0e276",
  measurementId: "G-TFJPQB436F",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
// auth.useDeviceLanguage(); // optional

export {
  auth,
  provider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
};
