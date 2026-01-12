
const { initializeApp } = require("firebase/app");
const { getFirestore, doc, updateDoc } = require("firebase/firestore");

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

async function fixCredentials() {
    const hospitalId = "vGoayTz2Ka61pCxbVr3n"; // ID from previous debug output
    console.log(`Updating credentials for hospital ID: ${hospitalId}...`);

    try {
        const hospitalRef = doc(db, "hospitals", hospitalId);
        await updateDoc(hospitalRef, {
            email: "citycarehospital@gmail.com",
            password: "citycare"
        });
        console.log("Success! Credentials updated.");
        console.log("Email: citycarehospital@gmail.com");
        console.log("Password: citycare");
    } catch (error) {
        console.error("Error updating document:", error);
    }
}

fixCredentials();
