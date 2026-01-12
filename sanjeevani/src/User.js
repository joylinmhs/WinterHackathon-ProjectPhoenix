import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

function User() {
  const [hospitals, setHospitals] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  // Get user current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(pos => {
      setUserLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      });
    });
  }, []);

  // Fetch hospitals
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "hospitals"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHospitals(data);
    });
    return () => unsub();
  }, []);

  // Distance calculation
  const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  const recommendedHospitals = userLocation
    ? hospitals
        .filter(h => h.icuBeds > 0)
        .map(h => ({
          ...h,
          distance: getDistance(userLocation.lat, userLocation.lng, h.lat, h.lng)
        }))
        .sort((a, b) => a.distance - b.distance)
    : [];

  return (
    <div>
      <h2>Recommended Hospitals Near Victim</h2>

      {!userLocation && <p>Fetching your location...</p>}

      {recommendedHospitals.slice(0, 3).map(h => (
        <div key={h.id}>
          <h3>{h.name}</h3>
          <p>Distance: {h.distance.toFixed(2)} km</p>
          <p>ICU Beds: {h.icuBeds}</p>
          <p>Oxygen: {h.oxygen ? "Available" : "Not Available"}</p>
          <p>Doctors: {h.doctors ? "Available" : "Not Available"}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default User;
