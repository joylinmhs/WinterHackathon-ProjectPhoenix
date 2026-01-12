import { useEffect, useState } from "react";
import { doc, updateDoc, onSnapshot, collection, query, where, addDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

function HospitalPortal({ hospitalId, onLogout }) {
    const [hospitalData, setHospitalData] = useState(null);
    const [requests, setRequests] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [ambulances, setAmbulances] = useState([]);
    const [newAmbulance, setNewAmbulance] = useState({ driverName: "", phone: "", vehicleNumber: "", isAvailable: true });

    // 1. Fetch Hospital Details Real-time
    useEffect(() => {
        if (!hospitalId) return;

        const unsub = onSnapshot(doc(db, "hospitals", hospitalId), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setHospitalData({ id: docSnap.id, ...data });
                if (!isEditing) {
                    setFormData({
                        icuBeds: data.icuBeds || 0,
                        oxygen: data.oxygen || false,
                        doctors: data.doctors || false,
                        name: data.name || "",
                        lat: data.lat || "",
                        lng: data.lng || ""
                    });
                }
            }
        });

        // Fetch Ambulances for this hospital
        const q = query(collection(db, "ambulances"), where("hospitalId", "==", hospitalId));
        const unsubAmbulances = onSnapshot(q, (snap) => {
            setAmbulances(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        return () => {
            unsub();
            unsubAmbulances();
        };
    }, [hospitalId, isEditing]);



    // Update Hospital Status
    const handleUpdateStatus = async () => {
        try {
            await updateDoc(doc(db, "hospitals", hospitalId), {
                icuBeds: parseInt(formData.icuBeds),
                oxygen: formData.oxygen,
                doctors: formData.doctors,
                name: formData.name,
                lat: parseFloat(formData.lat),
                lng: parseFloat(formData.lng)
            });
            setIsEditing(false);
            alert("Status updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
        }
    };

    const handleAddAmbulance = async (e) => {
        e.preventDefault();
        if (!newAmbulance.driverName || !newAmbulance.phone || !newAmbulance.vehicleNumber) {
            alert("Please fill all fields");
            return;
        }
        try {
            await addDoc(collection(db, "ambulances"), {
                ...newAmbulance,
                hospitalId: hospitalId,
                hospitalName: hospitalData.name
            });
            setNewAmbulance({ driverName: "", phone: "", vehicleNumber: "", isAvailable: true });
            alert("Ambulance added!");
        } catch (err) {
            console.error(err);
            alert("Error adding ambulance");
        }
    };

    const handleDeleteAmbulance = async (id) => {
        if (window.confirm("Are you sure you want to delete this ambulance?")) {
            await deleteDoc(doc(db, "ambulances", id));
        }
    };

    // Accept Request (Logic kept if needed in future, but UI removed)
    const acceptRequest = async (reqId) => {
        try {
            await updateDoc(doc(db, "emergencyRequests", reqId), {
                status: "Hospital Responded"
            });
        } catch (err) {
            console.error(err);
            alert("Failed to accept request");
        }
    };

    if (!hospitalData) return <div style={{ padding: 20 }}>Loading Hospital Portal...</div>;

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f4f7f6" }}>
            {/* Header */}
            <header style={{
                backgroundColor: "#2c3e50",
                color: "white",
                padding: "15px 30px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "24px" }}>🏥</span>
                    <h1 style={{ margin: 0, fontSize: "1.2rem" }}>{hospitalData.name} - Portal</h1>
                </div>
                <button
                    onClick={onLogout}
                    style={{
                        backgroundColor: "transparent",
                        border: "1px solid rgba(255,255,255,0.3)",
                        color: "white",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >
                    Logout
                </button>
            </header>

            <main style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}>

                {/* Top Section: Dashboard Stats & Controls */}
                <section style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                    marginBottom: "30px"
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                        <h2 style={{ margin: 0, color: "#34495e" }}>Manage Live Status</h2>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                style={{ backgroundColor: "#3498db", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer" }}
                            >
                                ✏️ Edit Details
                            </button>
                        )}
                    </div>

                    {isEditing && (
                        <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#ecf0f1", borderRadius: "8px" }}>
                            <h4 style={{ marginTop: 0, color: "#34495e" }}>📍 Location & Details</h4>
                            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                                <div style={{ flex: 2 }}>
                                    <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "bold", marginBottom: "5px" }}>Hospital Name</label>
                                    <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: "95%", padding: "10px", borderRadius: "5px", border: "1px solid #bdc3c7" }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "bold", marginBottom: "5px" }}>Latitude</label>
                                    <input type="number" step="any" value={formData.lat} onChange={e => setFormData({ ...formData, lat: e.target.value })} style={{ width: "90%", padding: "10px", borderRadius: "5px", border: "1px solid #bdc3c7" }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "bold", marginBottom: "5px" }}>Longitude</label>
                                    <input type="number" step="any" value={formData.lng} onChange={e => setFormData({ ...formData, lng: e.target.value })} style={{ width: "90%", padding: "10px", borderRadius: "5px", border: "1px solid #bdc3c7" }} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
                        {/* ICU Beds */}
                        <div style={{ flex: 1, minWidth: "200px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "8px", borderLeft: "4px solid #e74c3c" }}>
                            <h4 style={{ margin: "0 0 10px 0", color: "#7f8c8d" }}>Free ICU Beds</h4>
                            {isEditing ? (
                                <input
                                    type="number"
                                    value={formData.icuBeds}
                                    onChange={e => setFormData({ ...formData, icuBeds: e.target.value })}
                                    style={{ fontSize: "1.5rem", width: "80px", padding: "5px" }}
                                />
                            ) : (
                                <span style={{ fontSize: "2rem", fontWeight: "bold", color: "#2c3e50" }}>{hospitalData.icuBeds}</span>
                            )}
                        </div>

                        {/* Oxygen */}
                        <div style={{ flex: 1, minWidth: "200px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "8px", borderLeft: "4px solid #2ecc71" }}>
                            <h4 style={{ margin: "0 0 10px 0", color: "#7f8c8d" }}>Oxygen Supply</h4>
                            {isEditing ? (
                                <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "1.1rem" }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.oxygen}
                                        onChange={e => setFormData({ ...formData, oxygen: e.target.checked })}
                                        style={{ transform: "scale(1.5)" }}
                                    />
                                    Available
                                </label>
                            ) : (
                                <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: hospitalData.oxygen ? "#27ae60" : "#c0392b" }}>
                                    {hospitalData.oxygen ? "✅ Available" : "❌ Unavailable"}
                                </span>
                            )}
                        </div>

                        {/* Doctors */}
                        <div style={{ flex: 1, minWidth: "200px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "8px", borderLeft: "4px solid #f1c40f" }}>
                            <h4 style={{ margin: "0 0 10px 0", color: "#7f8c8d" }}>Emergency Doctors</h4>
                            {isEditing ? (
                                <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "1.1rem" }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.doctors}
                                        onChange={e => setFormData({ ...formData, doctors: e.target.checked })}
                                        style={{ transform: "scale(1.5)" }}
                                    />
                                    Available
                                </label>
                            ) : (
                                <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: hospitalData.doctors ? "#27ae60" : "#c0392b" }}>
                                    {hospitalData.doctors ? "✅ Available" : "❌ Unavailable"}
                                </span>
                            )}
                        </div>
                    </div>

                    {isEditing && (
                        <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                            <button
                                onClick={() => setIsEditing(false)}
                                style={{ backgroundColor: "#95a5a6", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer" }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateStatus}
                                style={{ backgroundColor: "#2ecc71", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer" }}
                            >
                                Save Changes
                            </button>
                        </div>
                    )}
                </section>

                {/* Ambulance Management Section */}
                <section style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
                }}>
                    <h2 style={{ margin: "0 0 20px 0", color: "#34495e" }}>🚑 Manage Ambulances</h2>

                    {/* Add Ambulance Form */}
                    <form onSubmit={handleAddAmbulance} style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "30px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                        <input
                            type="text"
                            placeholder="Driver Name"
                            value={newAmbulance.driverName}
                            onChange={e => setNewAmbulance({ ...newAmbulance, driverName: e.target.value })}
                            required
                            style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ddd", flex: 1 }}
                        />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={newAmbulance.phone}
                            onChange={e => setNewAmbulance({ ...newAmbulance, phone: e.target.value })}
                            required
                            style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ddd", flex: 1 }}
                        />
                        <input
                            type="text"
                            placeholder="Vehicle Number"
                            value={newAmbulance.vehicleNumber}
                            onChange={e => setNewAmbulance({ ...newAmbulance, vehicleNumber: e.target.value })}
                            required
                            style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ddd", flex: 1 }}
                        />
                        <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#3498db", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                            Add Ambulance
                        </button>
                    </form>

                    {/* Ambulance List */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                        {ambulances.map(amb => (
                            <div key={amb.id} style={{
                                padding: "15px",
                                border: "1px solid #eee",
                                borderRadius: "8px",
                                backgroundColor: "white",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                <div>
                                    <h4 style={{ margin: "0 0 5px 0", color: "#2c3e50" }}>{amb.driverName}</h4>
                                    <p style={{ margin: "0", color: "#7f8c8d", fontSize: "0.9rem" }}>📞 {amb.phone}</p>
                                    <p style={{ margin: "0", color: "#7f8c8d", fontSize: "0.9rem" }}>🚑 {amb.vehicleNumber}</p>
                                </div>
                                <button
                                    onClick={() => handleDeleteAmbulance(amb.id)}
                                    style={{
                                        backgroundColor: "#e74c3c",
                                        color: "white",
                                        border: "none",
                                        padding: "5px 10px",
                                        borderRadius: "4px",
                                        cursor: "pointer"
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                        {ambulances.length === 0 && <p style={{ color: "#95a5a6" }}>No ambulances added yet.</p>}
                    </div>
                </section>

                {/* Bottom Section: Requests Feed - Removed as per new requirement */}
                {/* <section>...</section> */}

            </main>
        </div>
    );
}

export default HospitalPortal;
