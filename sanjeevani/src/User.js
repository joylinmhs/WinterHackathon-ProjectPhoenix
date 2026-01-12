import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import Sidebar from "./Sidebar";
import AmbulanceAvailability from "./AmbulanceAvailability";
import BloodBank from "./BloodBank";
import FirstAidTips from "./FirstAidTips";

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
              <div style={{
                border: "2px solid #27ae60",
                padding: "20px",
                borderRadius: "10px",
                backgroundColor: "#f8fff8",
                marginBottom: "20px"
              }}>
                <h3 style={{ color: "#27ae60", marginTop: "0" }}>🏥 Recommended Hospital</h3>
                <p><strong>Name:</strong> {bestHospital.name}</p>
                <p><strong>Distance:</strong> {bestHospital.distance.toFixed(2)} km</p>
                <p><strong>ICU Beds:</strong> {bestHospital.icuBeds}</p>
                <p><strong>Oxygen:</strong> Available</p>
                <p><strong>Doctors:</strong> Available</p>

                <button
                  onClick={notifyHospital}
                  style={{
                    marginTop: "15px",
                    padding: "12px 24px",
                    backgroundColor: "#e74c3c",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "16px",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  🚨 Notify Hospital Now
                </button>
              </div>
            )}

            {!bestHospital && userLocation && (
              <div style={{
                border: "2px solid #f39c12",
                padding: "20px",
                borderRadius: "10px",
                backgroundColor: "#fffbf0",
                textAlign: "center"
              }}>
                <h3 style={{ color: "#f39c12", marginTop: "0" }}>⚠️ No Suitable Hospital Found</h3>
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
    <div style={{ position: "relative", minHeight: "calc(100vh - 80px)" }}>
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          ...sidebarToggleStyle,
          left: sidebarOpen ? "310px" : "10px"
        }}
      >
        {sidebarOpen ? "◁" : "▷"}
      </button>

      {/* Sidebar */}
      <div style={{
        position: "absolute",
        left: sidebarOpen ? "0" : "-300px",
        top: "0",
        width: "300px",
        height: "calc(100vh - 80px)",
        transition: "left 0.3s ease",
        zIndex: 100
      }}>
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>

      {/* Main Content */}
      <div style={{
        marginLeft: sidebarOpen ? "300px" : "0",
        backgroundColor: "#f8f9fa",
        minHeight: "calc(100vh - 80px)",
        transition: "margin-left 0.3s ease",
        position: "relative",
        zIndex: 50
      }}>
        {renderCurrentPage()}
      </div>
    </div>
  );
}

const sidebarToggleStyle = {
  position: "fixed",
  top: "50%",
  transform: "translateY(-50%)",
  backgroundColor: "#1976d2",
  color: "white",
  border: "none",
  borderRadius: "50%",
  width: "40px",
  height: "40px",
  fontSize: "16px",
  cursor: "pointer",
  zIndex: 1001,
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  transition: "all 0.3s ease"
};

export default User;
