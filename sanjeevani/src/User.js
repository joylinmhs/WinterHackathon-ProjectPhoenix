import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
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
  const [bestHospital, setBestHospital] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => alert("Location permission required")
    );
  }, []);

  useEffect(() => {
    async function fetchHospitals() {
      const snap = await getDocs(collection(db, "hospitals"));
      setHospitals(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    fetchHospitals();
  }, []);

  const distance = (a,b,c,d) => {
    const R = 6371;
    const dLat = (c-a) * Math.PI/180;
    const dLon = (d-b) * Math.PI/180;
    const x = Math.sin(dLat/2)**2 +
              Math.cos(a*Math.PI/180) *
              Math.cos(c*Math.PI/180) *
              Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
  };

  useEffect(() => {
    if(!userLocation || hospitals.length===0) return;

    const ranked = hospitals.map(h=>({
      ...h,
      distance: distance(userLocation.lat,userLocation.lng,h.lat,h.lng)
    }))
    .filter(h=>h.distance<=200 && h.icuBeds>0 && h.oxygen && h.doctors)
    .sort((a,b)=>a.distance-b.distance);

    setBestHospital(ranked[0] || null);
  },[userLocation,hospitals]);

  const notifyHospital = async () => {
    if(!bestHospital) return;

    await addDoc(collection(db,"emergencyRequests"),{
      hospitalId:bestHospital.id,
      lat:userLocation.lat,
      lng:userLocation.lng,
      status:"Pending",
      timestamp:serverTimestamp()
    });
    alert("Hospital notified");
  };

  const renderCurrentPage = () => {
    switch(currentPage) {
      case "emergency":
        return (
          <div style={{ padding: "20px" }}>
            <h2 style={{ color: "#1976d2", marginBottom: "20px" }}>🚑 Emergency Hospital Finder</h2>

            {!userLocation && <p>Getting your location...</p>}

            {bestHospital && (
              <div className="emergency-card">
                <h3 style={{ color: "var(--color-success)", marginTop: "0" }}>🏥 Recommended Hospital</h3>
                <p><strong>Name:</strong> {bestHospital.name}</p>
                <p><strong>Distance:</strong> {bestHospital.distance.toFixed(2)} km</p>
                <p><strong>ICU Beds:</strong> {bestHospital.icuBeds}</p>
                <p><strong>Oxygen:</strong> Available</p>
                <p><strong>Doctors:</strong> Available</p>

                <button
                  onClick={notifyHospital}
                  className="btn btn-success"
                  style={{ marginTop: "15px" }}
                >
                  🚨 Notify Hospital Now
                </button>
              </div>
            )}

            {!bestHospital && userLocation && (
              <div className="card" style={{
                border: "2px solid var(--color-warning)",
                backgroundColor: "rgba(171, 71, 188, 0.05)",
                textAlign: "center"
              }}>
                <h3 style={{ color: "var(--color-warning)", marginTop: "0" }}>⚠️ No Suitable Hospital Found</h3>
                <p>Please try the Ambulance service or contact emergency services directly.</p>
              </div>
            )}
          </div>
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
