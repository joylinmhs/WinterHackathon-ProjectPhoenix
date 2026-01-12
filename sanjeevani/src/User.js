import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

function User() {
  const [hospitals, setHospitals] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [bestHospital, setBestHospital] = useState(null);

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

  // 🏥 Fetch hospitals
  useEffect(() => {
    async function fetchHospitals() {
      const snapshot = await getDocs(collection(db, "hospitals"));
      setHospitals(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    fetchHospitals();
  }, []);

  // 📏 Distance calculator
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  // 🧠 Recommend best hospital
  useEffect(() => {
    if (!userLocation || hospitals.length === 0) return;

    const withDistance = hospitals.map(h => ({
      ...h,
      distance: calculateDistance(userLocation.lat, userLocation.lng, h.lat, h.lng)
    }));

    const findBest = (radius) =>
      withDistance
        .filter(h =>
          h.distance <= radius &&
          h.icuBeds > 0 &&
          h.oxygen &&
          h.doctors
        )
        .map(h => ({
          ...h,
          score:
            (h.icuBeds * 5) +
            (h.oxygen ? 10 : 0) +
            (h.doctors ? 8 : 0) -
            (h.distance * 2)
        }))
        .sort((a, b) => b.score - a.score)[0];

    const best = findBest(25) || findBest(200);
    setBestHospital(best || null);
  }, [userLocation, hospitals]);

  // 🚨 Notify hospital
  const notifyHospital = async () => {
    if (!bestHospital || !userLocation) return;

    await addDoc(collection(db, "emergencyRequests"), {
      hospitalId: bestHospital.id,
      emergencyType: "Accident",
      lat: userLocation.lat,
      lng: userLocation.lng,
      status: "Pending",
      timestamp: serverTimestamp()
    });

    alert("Hospital notified successfully!");
  };

  return (
    <div>
      <h2>🚑 Emergency Assistance</h2>

      {!userLocation && <p>Detecting your location...</p>}

      {!bestHospital && (
        <p style={{ color: "red" }}>
          No suitable hospital found nearby.
        </p>
      )}

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
          <p><strong>Oxygen:</strong> Available</p>
          <p><strong>Doctors:</strong> Available</p>

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
    </div>
  );
}

export default User;
