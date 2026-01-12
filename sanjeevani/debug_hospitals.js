
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");

// Using the same config as in firebase.js
const firebaseConfig = {
    apiKey: "AIzaSyCo_Pvt5LFImAxuvdAJc5N4dBZTgl7kE6o",
    authDomain: "sanjeevani-f13a2.firebaseapp.com",
    projectId: "sanjeevani-f13a2",
    storageBucket: "sanjeevani-f13a2.firebasestorage.app",
    messagingSenderId: "975339692384",
    appId: "1:975339692384:web:82dcffad1eeed6bedbfe05"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function listHospitals() {
    console.log("Fetching hospitals...");
    try {
        const querySnapshot = await getDocs(collection(db, "hospitals"));
        if (querySnapshot.empty) {
            console.log("No hospitals found in the database.");
        } else {
            console.log(`Found ${querySnapshot.size} hospitals:`);
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                console.log("--------------------------------");
                console.log(`ID: ${doc.id}`);
                console.log(`Name: ${data.name}`);
                console.log(`Email: '${data.email}'`);     // Quoted to see whitespace
                console.log(`Password: '${data.password}'`); // Quoted to see whitespace
            });
            console.log("--------------------------------");
        }
    } catch (error) {
        console.error("Error fetching hospitals:", error);
    }
}

listHospitals();
