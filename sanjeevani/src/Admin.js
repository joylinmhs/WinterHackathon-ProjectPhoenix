import { useEffect, useState } from "react";
import { query, where } from "firebase/firestore";

import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc
} from "firebase/firestore";
import { db } from "./firebase";

function Admin() {
  const [activeTab, setActiveTab] = useState("emergencies");
  const [requests, setRequests] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [bloodBanks, setBloodBanks] = useState([]);
  const [donors, setDonors] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  // New ambulance form
  const [newAmbulance, setNewAmbulance] = useState({
    name: "", location: "", phone: "", available: true
  });

  // New blood bank form
  const [newBloodBank, setNewBloodBank] = useState({
    name: "", location: "", phone: "", hours: ""
  });

  // New donor form
  const [newDonor, setNewDonor] = useState({
    name: "", bloodType: "", phone: "", location: ""
  });

  // New hospital form
  const [newHospital, setNewHospital] = useState({
    name: "", lat: "", lng: "", icuBeds: "", oxygen: false, doctors: false
  });

  // Emergency Requests
  useEffect(() => {
    const q = query(
      collection(db, "emergencyRequests"),
      where("status", "==", "Pending")
    );

    const unsub = onSnapshot(q, snap => {
      setRequests(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // Ambulances
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "ambulances"), snap => {
      setAmbulances(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // Blood Banks
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "bloodBanks"), snap => {
      setBloodBanks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // Donors
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "donors"), snap => {
      setDonors(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // Hospitals
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "hospitals"), snap => {
      setHospitals(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // Add new ambulance
  const addAmbulance = async () => {
    if (!newAmbulance.name || !newAmbulance.location || !newAmbulance.phone) {
      return alert("Please fill all fields");
    }
    await addDoc(collection(db, "ambulances"), newAmbulance);
    setNewAmbulance({ name: "", location: "", phone: "", available: true });
    alert("Ambulance added successfully");
  };

  // Add new blood bank
  const addBloodBank = async () => {
    if (!newBloodBank.name || !newBloodBank.location || !newBloodBank.phone) {
      return alert("Please fill all fields");
    }
    await addDoc(collection(db, "bloodBanks"), newBloodBank);
    setNewBloodBank({ name: "", location: "", phone: "", hours: "" });
    alert("Blood bank added successfully");
  };

  // Add new donor
  const addDonor = async () => {
    if (!newDonor.name || !newDonor.bloodType || !newDonor.phone) {
      return alert("Please fill all fields");
    }
    await addDoc(collection(db, "donors"), newDonor);
    setNewDonor({ name: "", bloodType: "", phone: "", location: "" });
    alert("Donor added successfully");
  };

  // Add new hospital
  const addHospital = async () => {
    if (!newHospital.name || !newHospital.lat || !newHospital.lng) {
      return alert("Please fill all fields");
    }
    await addDoc(collection(db, "hospitals"), {
      ...newHospital,
      lat: parseFloat(newHospital.lat),
      lng: parseFloat(newHospital.lng),
      icuBeds: parseInt(newHospital.icuBeds) || 0
    });
    setNewHospital({ name: "", lat: "", lng: "", icuBeds: "", oxygen: false, doctors: false });
    alert("Hospital added successfully");
  };

  // Delete functions
  const deleteAmbulance = async (id) => {
    if (window.confirm("Delete this ambulance?")) {
      await deleteDoc(doc(db, "ambulances", id));
    }
  };

  const deleteBloodBank = async (id) => {
    if (window.confirm("Delete this blood bank?")) {
      await deleteDoc(doc(db, "bloodBanks", id));
    }
  };

  const deleteDonor = async (id) => {
    if (window.confirm("Delete this donor?")) {
      await deleteDoc(doc(db, "donors", id));
    }
  };

  const deleteHospital = async (id) => {
    if (window.confirm("Delete this hospital?")) {
      await deleteDoc(doc(db, "hospitals", id));
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🏥 Hospital Admin Dashboard</h2>

      {/* Tab Navigation */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setActiveTab("emergencies")}
          style={{
            padding: "10px 20px",
            marginRight: 10,
            backgroundColor: activeTab === "emergencies" ? "#3498db" : "#ecf0f1",
            color: activeTab === "emergencies" ? "white" : "black",
            border: "none",
            borderRadius: 5,
            cursor: "pointer"
          }}
        >
          🚨 Emergency Requests
        </button>
        <button
          onClick={() => setActiveTab("ambulances")}
          style={{
            padding: "10px 20px",
            marginRight: 10,
            backgroundColor: activeTab === "ambulances" ? "#3498db" : "#ecf0f1",
            color: activeTab === "ambulances" ? "white" : "black",
            border: "none",
            borderRadius: 5,
            cursor: "pointer"
          }}
        >
          🚑 Manage Ambulances
        </button>
        <button
          onClick={() => setActiveTab("bloodbanks")}
          style={{
            padding: "10px 20px",
            marginRight: 10,
            backgroundColor: activeTab === "bloodbanks" ? "#3498db" : "#ecf0f1",
            color: activeTab === "bloodbanks" ? "white" : "black",
            border: "none",
            borderRadius: 5,
            cursor: "pointer"
          }}
        >
          🩸 Manage Blood Banks
        </button>
        <button
          onClick={() => setActiveTab("donors")}
          style={{
            padding: "10px 20px",
            marginRight: 10,
            backgroundColor: activeTab === "donors" ? "#3498db" : "#ecf0f1",
            color: activeTab === "donors" ? "white" : "black",
            border: "none",
            borderRadius: 5,
            cursor: "pointer"
          }}
        >
          💉 Manage Donors
        </button>
        <button
          onClick={() => setActiveTab("hospitals")}
          style={{
            padding: "10px 20px",
            backgroundColor: activeTab === "hospitals" ? "#3498db" : "#ecf0f1",
            color: activeTab === "hospitals" ? "white" : "black",
            border: "none",
            borderRadius: 5,
            cursor: "pointer"
          }}
        >
          🏥 Manage Hospitals
        </button>
      </div>

      {/* Emergency Requests Tab */}
      {activeTab === "emergencies" && (
        <div>
          <h3>🚨 Emergency Requests</h3>
          {requests.length === 0 && <p>No emergency requests yet</p>}

          {requests.map(req => (
            <div key={req.id} style={{
              border: "1px solid #ccc",
              padding: 12,
              marginBottom: 10,
              borderRadius: 6
            }}>
              <p><b>Emergency:</b> {req.emergencyType}</p>
              <p><b>Status:</b> {req.status}</p>
              <a
                href={`https://www.google.com/maps?q=${req.lat},${req.lng}`}
                target="_blank"
                rel="noreferrer"
              >
                📍 Open Patient Location in Google Maps
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Ambulances Tab */}
      {activeTab === "ambulances" && (
        <div>
          <h3>🚑 Manage Ambulances</h3>

          {/* Add New Ambulance Form */}
          <div style={{ border: "1px solid #ccc", padding: 15, marginBottom: 20, borderRadius: 6 }}>
            <h4>Add New Ambulance</h4>
            <input
              type="text"
              placeholder="Ambulance Name"
              value={newAmbulance.name}
              onChange={e => setNewAmbulance({ ...newAmbulance, name: e.target.value })}
              style={{ width: "100%", marginBottom: 10, padding: 8 }}
            />
            <input
              type="text"
              placeholder="Location"
              value={newAmbulance.location}
              onChange={e => setNewAmbulance({ ...newAmbulance, location: e.target.value })}
              style={{ width: "100%", marginBottom: 10, padding: 8 }}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={newAmbulance.phone}
              onChange={e => setNewAmbulance({ ...newAmbulance, phone: e.target.value })}
              style={{ width: "100%", marginBottom: 10, padding: 8 }}
            />
            <label>
              <input
                type="checkbox"
                checked={newAmbulance.available}
                onChange={e => setNewAmbulance({ ...newAmbulance, available: e.target.checked })}
              />
              Available
            </label>
            <button
              onClick={addAmbulance}
              style={{
                marginTop: 10,
                padding: 10,
                backgroundColor: "#3498db",
                color: "white",
                border: "none",
                borderRadius: 5,
                width: "100%"
              }}
            >
              ➕ Add Ambulance
            </button>
          </div>

          {/* List of Ambulances */}
          <h4>Current Ambulances</h4>
          {ambulances.length === 0 && <p>No ambulances registered</p>}
          {ambulances.map(amb => (
            <div key={amb.id} style={{
              border: "1px solid #ccc",
              padding: 12,
              marginBottom: 10,
              borderRadius: 6,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <p><b>{amb.name}</b></p>
                <p>📍 {amb.location}</p>
                <p>📞 {amb.phone}</p>
                <p>Status: {amb.available ? "✅ Available" : "❌ Unavailable"}</p>
              </div>
              <button
                onClick={() => deleteAmbulance(amb.id)}
                style={{
                  padding: 8,
                  backgroundColor: "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: 5
                }}
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Blood Banks Tab */}
      {activeTab === "bloodbanks" && (
        <div>
          <h3>🩸 Manage Blood Banks</h3>

          {/* Add New Blood Bank Form */}
          <div style={{ border: "1px solid #ccc", padding: 15, marginBottom: 20, borderRadius: 6 }}>
            <h4>Add New Blood Bank</h4>
            <input
              type="text"
              placeholder="Blood Bank Name"
              value={newBloodBank.name}
              onChange={e => setNewBloodBank({ ...newBloodBank, name: e.target.value })}
              style={{ width: "100%", marginBottom: 10, padding: 8 }}
            />
            <input
              type="text"
              placeholder="Location"
              value={newBloodBank.location}
              onChange={e => setNewBloodBank({ ...newBloodBank, location: e.target.value })}
              style={{ width: "100%", marginBottom: 10, padding: 8 }}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={newBloodBank.phone}
              onChange={e => setNewBloodBank({ ...newBloodBank, phone: e.target.value })}
              style={{ width: "100%", marginBottom: 10, padding: 8 }}
            />
            <input
              type="text"
              placeholder="Operating Hours"
              value={newBloodBank.hours}
              onChange={e => setNewBloodBank({ ...newBloodBank, hours: e.target.value })}
              style={{ width: "100%", marginBottom: 10, padding: 8 }}
            />
            <button
              onClick={addBloodBank}
              style={{
                marginTop: 10,
                padding: 10,
                backgroundColor: "#3498db",
                color: "white",
                border: "none",
                borderRadius: 5,
                width: "100%"
              }}
            >
              ➕ Add Blood Bank
            </button>
          </div>

          {/* List of Blood Banks */}
          <h4>Current Blood Banks</h4>
          {bloodBanks.length === 0 && <p>No blood banks registered</p>}
          {bloodBanks.map(bb => (
            <div key={bb.id} style={{
              border: "1px solid #ccc",
              padding: 12,
              marginBottom: 10,
              borderRadius: 6,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <p><b>{bb.name}</b></p>
                <p>📍 {bb.location}</p>
                <p>📞 {bb.phone}</p>
                <p>🕒 {bb.hours}</p>
              </div>
              <button
                onClick={() => deleteBloodBank(bb.id)}
                style={{
                  padding: 8,
                  backgroundColor: "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: 5
                }}
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Donors Tab */}
      {activeTab === "donors" && (
        <div>
          <h3>💉 Manage Donors</h3>

          {/* Add New Donor Form */}
          <div style={{ border: "1px solid #ccc", padding: 15, marginBottom: 20, borderRadius: 6 }}>
            <h4>Add New Donor</h4>
            <input
              type="text"
              placeholder="Donor Name"
              value={newDonor.name}
              onChange={e => setNewDonor({ ...newDonor, name: e.target.value })}
              style={{ width: "100%", marginBottom: 10, padding: 8 }}
            />
            <select
              value={newDonor.bloodType}
              onChange={e => setNewDonor({ ...newDonor, bloodType: e.target.value })}
              style={{ width: "100%", marginBottom: 10, padding: 8 }}
            >
              <option value="">Select Blood Type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
            <input
              type="tel"
              placeholder="Phone Number"
              value={newDonor.phone}
              onChange={e => setNewDonor({ ...newDonor, phone: e.target.value })}
              style={{ width: "100%", marginBottom: 10, padding: 8 }}
            />
            <input
              type="text"
              placeholder="Location"
              value={newDonor.location}
              onChange={e => setNewDonor({ ...newDonor, location: e.target.value })}
              style={{ width: "100%", marginBottom: 10, padding: 8 }}
            />
            <button
              onClick={addDonor}
              style={{
                marginTop: 10,
                padding: 10,
                backgroundColor: "#3498db",
                color: "white",
                border: "none",
                borderRadius: 5,
                width: "100%"
              }}
            >
              ➕ Add Donor
            </button>
          </div>

          {/* List of Donors */}
          <h4>Current Donors</h4>
          {donors.length === 0 && <p>No donors registered</p>}
          {donors.map(donor => (
            <div key={donor.id} style={{
              border: "1px solid #ccc",
              padding: 12,
              marginBottom: 10,
              borderRadius: 6,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <p><b>{donor.name}</b></p>
                <p>🩸 Blood Type: {donor.bloodType}</p>
                <p>📞 {donor.phone}</p>
                <p>📍 {donor.location}</p>
              </div>
              <button
                onClick={() => deleteDonor(donor.id)}
                style={{
                  padding: 8,
                  backgroundColor: "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: 5
                }}
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Hospitals Tab */}
      {activeTab === "hospitals" && (
        <div>
          <h3>🏥 Manage Hospitals</h3>

          {/* Add New Hospital Form */}
          <div style={{ border: "1px solid #ccc", padding: 15, marginBottom: 20, borderRadius: 6 }}>
            <h4>Add New Hospital</h4>
            <input
              type="text"
              placeholder="Hospital Name"
              value={newHospital.name}
              onChange={e => setNewHospital({ ...newHospital, name: e.target.value })}
              style={{ width: "100%", marginBottom: 10, padding: 8 }}
            />
            <input
              type="number"
              step="any"
              placeholder="Latitude"
              value={newHospital.lat}
              onChange={e => setNewHospital({ ...newHospital, lat: e.target.value })}
              style={{ width: "48%", marginBottom: 10, padding: 8, marginRight: "4%" }}
            />
            <input
              type="number"
              step="any"
              placeholder="Longitude"
              value={newHospital.lng}
              onChange={e => setNewHospital({ ...newHospital, lng: e.target.value })}
              style={{ width: "48%", marginBottom: 10, padding: 8 }}
            />
            <input
              type="number"
              placeholder="ICU Beds Available"
              value={newHospital.icuBeds}
              onChange={e => setNewHospital({ ...newHospital, icuBeds: e.target.value })}
              style={{ width: "100%", marginBottom: 10, padding: 8 }}
            />
            <label style={{ marginRight: 20 }}>
              <input
                type="checkbox"
                checked={newHospital.oxygen}
                onChange={e => setNewHospital({ ...newHospital, oxygen: e.target.checked })}
              />
              Oxygen Available
            </label>
            <label>
              <input
                type="checkbox"
                checked={newHospital.doctors}
                onChange={e => setNewHospital({ ...newHospital, doctors: e.target.checked })}
              />
              Doctors Available
            </label>
            <button
              onClick={addHospital}
              style={{
                marginTop: 10,
                padding: 10,
                backgroundColor: "#3498db",
                color: "white",
                border: "none",
                borderRadius: 5,
                width: "100%"
              }}
            >
              ➕ Add Hospital
            </button>
          </div>

          {/* List of Hospitals */}
          <h4>Current Hospitals</h4>
          {hospitals.length === 0 && <p>No hospitals registered</p>}
          {hospitals.map(hosp => (
            <div key={hosp.id} style={{
              border: "1px solid #ccc",
              padding: 12,
              marginBottom: 10,
              borderRadius: 6,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <p><b>{hosp.name}</b></p>
                <p>📍 Lat: {hosp.lat}, Lng: {hosp.lng}</p>
                <p>🛏️ ICU Beds: {hosp.icuBeds}</p>
                <p>💨 Oxygen: {hosp.oxygen ? "✅" : "❌"} | 👨‍⚕️ Doctors: {hosp.doctors ? "✅" : "❌"}</p>
              </div>
              <button
                onClick={() => deleteHospital(hosp.id)}
                style={{
                  padding: 8,
                  backgroundColor: "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: 5
                }}
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Admin;
