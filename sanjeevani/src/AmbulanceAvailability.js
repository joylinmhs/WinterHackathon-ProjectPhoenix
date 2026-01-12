import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

function AmbulanceAvailability() {
  const [ambulances, setAmbulances] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => alert("Location permission required")
    );
  }, []);

  useEffect(() => {
    async function fetchAmbulances() {
      const snap = await getDocs(collection(db, "ambulances"));
      setAmbulances(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    fetchAmbulances();
  }, []);

  const distance = (a, b, c, d) => {
    const R = 6371;
    const dLat = (c - a) * Math.PI / 180;
    const dLon = (d - b) * Math.PI / 180;
    const x = Math.sin(dLat / 2) ** 2 +
      Math.cos(a * Math.PI / 180) *
      Math.cos(c * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#1976d2", marginBottom: "20px" }}>🚑 Ambulance Availability</h2>

      {!userLocation && <p>Getting your location...</p>}

      <div style={{ display: "grid", gap: "15px" }}>
        {ambulances.map(ambulance => {
          return (
            <div key={ambulance.id} style={{
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              padding: "15px",
              backgroundColor: "#ffffff"
            }}>
              <h3 style={{ margin: "0 0 5px 0", color: "#333" }}>{ambulance.hospitalName || "Unknown Hospital"}</h3>
              <p style={{ margin: "5px 0", fontWeight: "bold", color: "#555" }}>🚑 Vehicle: {ambulance.vehicleNumber}</p>
              <p style={{ margin: "5px 0", color: "#666" }}>👨‍✈️ Driver: {ambulance.driverName}</p>
              <p style={{ margin: "5px 0", color: "#666" }}>📞 {ambulance.phone}</p>
              <p style={{ margin: "5px 0", color: "#666" }}>
                🚦 Status: <span style={{
                  color: ambulance.isAvailable ? "#27ae60" : "#e74c3c",
                  fontWeight: "bold"
                }}>
                  {ambulance.isAvailable ? "Available" : "Busy"}
                </span>
              </p>
            </div >
          );
        })}
      </div >

      {
        ambulances.length === 0 && (
          <p style={{ textAlign: "center", color: "#666", marginTop: "20px" }}>
            No ambulances available at the moment.
          </p>
        )
      }
    </div >
  );
}

export default AmbulanceAvailability;