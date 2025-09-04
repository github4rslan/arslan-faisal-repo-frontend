// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your Firebase config (integrated with your details)
const firebaseConfig = {
  apiKey: "AIzaSyBVRoQi7a8e_0b9ErwE6WPzWLqATvMqfQA",  // Your API key
  authDomain: "my-first-mern-app-c93ca.firebaseapp.com",  // Your Auth domain
  projectId: "my-first-mern-app-c93ca",  // Your project ID
  storageBucket: "my-first-mern-app-c93ca.firebasestorage.app",  // Your Storage Bucket
  messagingSenderId: "736959316163",  // Your Messaging Sender ID
  appId: "1:736959316163:web:9c72795b17b4122dd0e276",  // Your App ID
  measurementId: "G-TFJPQB436F"  // Your Measurement ID (for Analytics)
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);  // Get Firebase Authentication instance
const provider = new GoogleAuthProvider();  // Create GoogleAuth provider

// Export Firebase auth methods for use in other parts of your app
export { auth, provider, signInWithPopup };
