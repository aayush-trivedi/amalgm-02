// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs, FieldValue, Timestamp } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCv3BA2minzlpZEHoV0lhqGnXM70H4sD4Y",
  authDomain: "amalgm-taskmaster.firebaseapp.com",
  projectId: "amalgm-taskmaster",
  storageBucket: "amalgm-taskmaster.appspot.com",
  messagingSenderId: "540979190170",
  appId: "1:540979190170:web:c714129a52daa8fb7d4223",
  measurementId: "G-B32X9YW7B5"
};


// Initialize Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export {db, auth, provider};