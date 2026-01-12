import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

function User() {
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

  return (
  <div style={{ display:"flex", justifyContent:"center" }}>
    <div className="card">
      <h2 className="title">🚑 Emergency Assistance</h2>

      {bestHospital && (
        <>
          <span className="badge">Recommended Hospital</span>

          <p><strong>Name:</strong> {bestHospital.name}</p>
          <p><strong>Distance:</strong> {bestHospital.distance.toFixed(2)} km</p>
          <p><strong>ICU Beds:</strong> {bestHospital.icuBeds}</p>

          <button
            onClick={notifyHospital}
            style={{
              marginTop: "10px",
              padding: "10px",
              width: "100%",
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer"
            }}
          >
            🚨 Notify Hospital Now
          </button>
        </>
      )}
    </div>
  </div>
);

}

export default User;
