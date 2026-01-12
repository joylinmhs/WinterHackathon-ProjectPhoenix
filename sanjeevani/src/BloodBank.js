import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

function BloodBank() {
  const [bloodBanks, setBloodBanks] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => alert("Location permission required")
    );
  }, []);

  useEffect(() => {
    async function fetchBloodBanks() {
      const snap = await getDocs(collection(db, "bloodBanks"));
      setBloodBanks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    fetchBloodBanks();
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
      <h2 style={{ color: "#d32f2f", marginBottom: "20px" }}>🩸 Blood Bank Services</h2>

      {!userLocation && <p>Getting your location...</p>}

      <div style={{ display: "grid", gap: "15px" }}>
        {bloodBanks.map(bloodBank => {
          const dist = userLocation ? distance(userLocation.lat, userLocation.lng, bloodBank.lat, bloodBank.lng) : 0;

          return (
            <div key={bloodBank.id} style={{
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              padding: "15px",
              backgroundColor: "#ffffff"
            }}>
              <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>{bloodBank.name}</h3>
              <p style={{ margin: "5px 0", color: "#666" }}>📍 {bloodBank.location}</p>
              <p style={{ margin: "5px 0", color: "#666" }}>📞 {bloodBank.phone}</p>
              <p style={{ margin: "5px 0", color: "#666" }}>⏰ {bloodBank.hours}</p>

              {userLocation && (
                <p style={{ margin: "5px 0", color: "#666" }}>
                  📏 Distance: {dist.toFixed(2)} km
                </p>
              )}

              {/* Blood Type Availability */}
              <div style={{ margin: "10px 0" }}>
                <h4 style={{ margin: "0 0 8px 0", color: "#555" }}>Available Blood Types:</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {bloodTypes.map(type => {
                    const available = bloodBank.bloodTypes && bloodBank.bloodTypes[type];
                    return (
                      <span key={type} style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        backgroundColor: available ? "#e8f5e8" : "#ffeaea",
                        color: available ? "#27ae60" : "#e74c3c",
                        border: `1px solid ${available ? "#27ae60" : "#e74c3c"}`
                      }}>
                        {type}: {available || 0} units
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {bloodBanks.length === 0 && (
        <p style={{ textAlign: "center", color: "#666", marginTop: "20px" }}>
          No blood banks available at the moment.
        </p>
      )}
    </div>
  );
}

export default BloodBank;