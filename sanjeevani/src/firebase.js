// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCo_Pvt5LFImAxuvdAJc5N4dBZTgl7kE6o",
  authDomain: "sanjeevani-f13a2.firebaseapp.com",
  projectId: "sanjeevani-f13a2",
  storageBucket: "sanjeevani-f13a2.firebasestorage.app",
  messagingSenderId: "975339692384",
  appId: "1:975339692384:web:82dcffad1eeed6bedbfe05"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);