import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

function User() {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "hospitals"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHospitals(data);
    });

    return () => unsub();
  }, []);

  return (
    <div>
      <h2>Available Hospitals</h2>
      {hospitals.map(h => (
        <div key={h.id}>
          <h3>{h.name}</h3>
          <p>ICU Beds: {h.icuBeds}</p>
          <p>Oxygen: {h.oxygen ? "Yes" : "No"}</p>
          <p>Doctors: {h.doctors ? "Yes" : "No"}</p>
        </div>
      ))}
    </div>
  );
}

export default User;