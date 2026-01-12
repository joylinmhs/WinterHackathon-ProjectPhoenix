const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");

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
const db = getFirestore(app);

async function testConnection() {
    try {
        console.log("Attempting to connect...");
        const querySnapshot = await getDocs(collection(db, "hospitals"));
        console.log("Connection successful!");
        console.log(`Found ${querySnapshot.size} hospitals.`);
    } catch (e) {
        console.error("Connection failed:", e.message);
    }
}

testConnection();
