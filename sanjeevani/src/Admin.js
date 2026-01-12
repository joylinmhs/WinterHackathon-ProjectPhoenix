import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useState } from "react";

function Admin() {
  const [id, setId] = useState("");
  const [icu, setIcu] = useState("");
  const [oxygen, setOxygen] = useState(false);
  const [doctors, setDoctors] = useState(false);

  const updateHospital = async () => {
    await updateDoc(doc(db, "hospitals", id), {
      icuBeds: Number(icu),
      oxygen: oxygen,
      doctors: doctors
    });
    alert("Hospital data updated successfully!");
  };

  return (
    <div>
      <h2>Hospital Admin Panel</h2>
      <input placeholder="Hospital Document ID" onChange={e => setId(e.target.value)} />
      <input placeholder="ICU Beds" onChange={e => setIcu(e.target.value)} />
      <label>
        <input type="checkbox" onChange={e => setOxygen(e.target.checked)} /> Oxygen Available
      </label>
      <label>
        <input type="checkbox" onChange={e => setDoctors(e.target.checked)} /> Doctors Available
      </label>
      <button onClick={updateHospital}>Update Hospital</button>
    </div>
  );
}

export default Admin;