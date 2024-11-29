// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore/lite';
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAS5vh_TueKCAtf2ukFA7yBqaiet_QELjI",
  authDomain: "legnfirebase.firebaseapp.com",
  projectId: "legnfirebase",
  storageBucket: "legnfirebase.appspot.com",
  messagingSenderId: "912126483384",
  appId: "1:912126483384:web:d7077c19f574cde32bcd4d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export default db
export const auth = getAuth(app)