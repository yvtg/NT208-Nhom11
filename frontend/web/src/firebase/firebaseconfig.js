import { initializeApp } from "firebase/app";
import { getFirestore, collection, setDoc, doc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, GithubAuthProvider } from "firebase/auth";


// Firebase configuration (Move sensitive data to .env file in production)
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    database: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore database
const db = getFirestore(app);


// Initialize Authentication
const auth = getAuth(app);


// Sign-up with google
const googleProvider = new GoogleAuthProvider();

//Sign-up with Facebook
const facebookProvider = new FacebookAuthProvider();

// Export services
export { app, db, auth, collection, createUserWithEmailAndPassword, setDoc, doc, googleProvider, facebookProvider , signInWithPopup, GithubAuthProvider  };