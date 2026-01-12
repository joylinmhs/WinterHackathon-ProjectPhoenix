const { initializeApp } = require("firebase/app");
const { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp, orderBy, limit } = require("firebase/firestore");

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

async function simulateResponse() {
    try {
        console.log("Looking for pending requests...");
        const q = query(
            collection(db, "emergencyRequests"),
            where("status", "==", "Pending"),
            orderBy("timestamp", "desc"),
            limit(1)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log("No pending requests found.");
            return;
        }

        const reqDoc = snapshot.docs[0];
        const reqData = reqDoc.data();
        console.log(`Found request ${reqDoc.id} from ${reqData.timestamp.toDate()}`);

        // Send Tip
        console.log("Sending tip...");
        await addDoc(collection(db, "firstAidTips"), {
            emergencyId: reqDoc.id,
            hospitalId: reqData.hospitalId,
            message: "Stay calm. An ambulance has been dispatched. Apply pressure if bleeding.",
            timestamp: serverTimestamp()
        });

        // Update Status
        console.log("Updating status...");
        await updateDoc(doc(db, "emergencyRequests", reqDoc.id), {
            status: "Hospital Responded"
        });

        console.log("Response simulated successfully!");

    } catch (e) {
        console.error("Error:", e);
    }
}

simulateResponse();
