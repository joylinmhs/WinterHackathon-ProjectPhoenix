import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";   // adjust path if needed

function User() {
  const [hospitals, setHospitals] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [bestHospital, setBestHospital] = useState(null);
  const notifyHospital = async () => {
  if (!bestHospital || !userLocation) return;

  await addDoc(collection(db, "emergencyRequests"), {
    patientName: "Demo Patient",
    emergencyType: "Accident",
    hospitalId: bestHospital.id,
    lat: userLocation.lat,
    lng: userLocation.lng,
    status: "Pending",
    timestamp: serverTimestamp()
  });

  alert("🚑 Hospital notified successfully!");
};

  // 📍 Get patient current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      () => alert("Location access required for emergency assistance")
    );
  }, []);

  // 🏥 Fetch hospitals from Firebase
  useEffect(() => {
    async function fetchHospitals() {
      const snapshot = await getDocs(collection(db, "hospitals"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHospitals(data);
    }
    fetchHospitals();
  }, []);

  // 🧠 Recommend BEST hospital
  useEffect(() => {
    if (!userLocation || hospitals.length === 0) return;

    function calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
      return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    }

    const eligibleHospitals = hospitals.filter(h =>
      h.icuBeds > 0 && h.oxygen && h.doctors
    );

    const ranked = eligibleHospitals.map(h => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        h.lat,
        h.lng
      );

      const score =
        (-distance) +
        (h.icuBeds * 3) +
        (h.oxygen ? 5 : 0) +
        (h.doctors ? 4 : 0) +
        (h.bloodBank ? 2 : 0);

      return { ...h, distance, score };
    }).sort((a, b) => b.score - a.score);

    setBestHospital(ranked[0]);
  }, [userLocation, hospitals]);

  return (
    <div>
      <h2>🚑 Emergency Assistance</h2>

      {!userLocation && <p>Detecting your location...</p>}

      {bestHospital && (
        <div style={{
          border: "2px solid green",
          padding: "15px",
          borderRadius: "8px",
          backgroundColor: "#ecfdf5"
        }}>
          <h3>🏥 Recommended Hospital</h3>
          <p><strong>Name:</strong> {bestHospital.name}</p>
          <p><strong>Distance:</strong> {bestHospital.distance.toFixed(2)} km</p>
          <p><strong>ICU Beds:</strong> {bestHospital.icuBeds}</p>
          <p><strong>Oxygen:</strong> {bestHospital.oxygen ? "Available" : "No"}</p>
          <p><strong>Doctors:</strong> {bestHospital.doctors ? "Available" : "No"}</p>
          <p><strong>Blood Bank:</strong> {bestHospital.bloodBank ? "Available" : "No"}</p>

         <button
  onClick={notifyHospital}
  style={{
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "5px"
  }}
>
  🚨 Notify Hospital
</button>
        </div>
      )}

      <hr />

      <h3>🏥 Nearby Hospitals</h3>
      {hospitals.map(h => (
        <div key={h.id} style={{ marginBottom: "10px" }}>
          <strong>{h.name}</strong> | ICU: {h.icuBeds} | Oxygen: {h.oxygen ? "Yes" : "No"}
        </div>
      ))}
    </div>
  );
}

export default User;
