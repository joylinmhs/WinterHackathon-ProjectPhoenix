import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import Sidebar from "./Sidebar";
import AmbulanceAvailability from "./AmbulanceAvailability";
import BloodBank from "./BloodBank";
import FirstAidTips from "./FirstAidTips";
import "./App.css";

function User() {
  const [currentPage, setCurrentPage] = useState("emergency");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hospitals, setHospitals] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [rankedHospitals, setRankedHospitals] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => alert("Location permission required")
    );
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "hospitals"), snap => {
      setHospitals(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
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

  useEffect(() => {
    if (!userLocation || hospitals.length === 0) return;

    const ranked = hospitals.map(h => ({
      ...h,
      distance: distance(userLocation.lat, userLocation.lng, h.lat, h.lng)
    }))
      .filter(h => h.icuBeds > 0 || h.oxygen || h.doctors) // Show if ANY resource is available, removed distance limit
      .sort((a, b) => a.distance - b.distance);

    setRankedHospitals(ranked);
  }, [userLocation, hospitals]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "emergency":
        return (
          <div style={{ padding: "20px" }}>
            <h2 style={{ color: "#1976d2", marginBottom: "20px" }}>🚑 Emergency Hospital Finder</h2>

            {!userLocation && <p>Getting your location...</p>}

            {!userLocation && hospitals.length === 0 && <p>Loading hospitals...</p>}

            {userLocation && rankedHospitals.length === 0 && (
              <div className="card" style={{
                border: "2px solid var(--color-warning)",
                backgroundColor: "rgba(171, 71, 188, 0.05)",
                textAlign: "center"
              }}>
                <h3 style={{ color: "var(--color-warning)", marginTop: "0" }}>⚠️ No Suitable Hospital Found</h3>
                <p>Please try the Ambulance service or contact emergency services directly.</p>
              </div>
            )}

            {rankedHospitals.map((hospital, index) => (
              <div key={hospital.id} className="emergency-card" style={{ marginBottom: "20px", position: "relative" }}>
                {index === 0 && (
                  <span style={{
                    position: "absolute",
                    top: "-10px",
                    right: "-10px",
                    backgroundColor: "#2ecc71",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "20px",
                    fontWeight: "bold",
                    fontSize: "0.8rem",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
                  }}>
                    🌟 Nearest
                  </span>
                )}
                <h3 style={{ color: "var(--color-success)", marginTop: "0" }}>🏥 {hospital.name}</h3>
                <p><strong>Distance:</strong> {hospital.distance.toFixed(2)} km</p>
                <div style={{ display: "flex", gap: "15px", margin: "10px 0" }}>
                  <span style={{ color: hospital.icuBeds > 0 ? "green" : "red" }}>🛏️ Beds: {hospital.icuBeds}</span>
                  <span style={{ color: hospital.oxygen ? "green" : "red" }}>💨 Oxygen: {hospital.oxygen ? "Yes" : "No"}</span>
                  <span style={{ color: hospital.doctors ? "green" : "red" }}>👨‍⚕️ Doctors: {hospital.doctors ? "Yes" : "No"}</span>
                </div>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-success"
                  style={{
                    marginTop: "10px",
                    fontSize: "1rem",
                    textAlign: "center",
                    display: "inline-block",
                    textDecoration: "none",
                    width: "100%"
                  }}
                >
                  📍 Get Directions
                </a>
              </div>
            ))}
          </div >
        );
      case "ambulance":
        return <AmbulanceAvailability />;
      case "bloodbank":
        return <BloodBank />;
      case "firstaid":
        return <FirstAidTips />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="user-container">
      {/* Sidebar Toggle Button - Always Visible */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="sidebar-toggle-fixed"
        style={{
          position: 'fixed',
          top: '50%',
          left: sidebarOpen ? '260px' : '10px',
          transform: 'translateY(-50%)',
          zIndex: 1000,
          background: 'var(--color-primary)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          fontSize: '18px',
          cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          transition: 'left 0.3s ease, background-color 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
      >
        {sidebarOpen ? "▷" : "◁"}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </aside>

      {/* Main Content */}
      <main className={`user-main ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {renderCurrentPage()}
      </main>
    </div>
  );
}

export default User;
