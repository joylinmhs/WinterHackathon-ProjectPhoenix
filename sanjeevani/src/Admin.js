import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

function Admin() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    async function fetchRequests() {
      const snapshot = await getDocs(collection(db, "emergencyRequests"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(data);
    }
    fetchRequests();
  }, []);

  const acknowledgeRequest = async (id) => {
    await updateDoc(doc(db, "emergencyRequests", id), {
      status: "Hospital Prepared"
    });
    alert("Patient acknowledged and prepared!");
  };

  return (
    <div>
      <h2>🏥 Hospital Admin Dashboard</h2>

      {requests.length === 0 && <p>No emergency requests yet</p>}

      {requests.map(req => (
        <div
          key={req.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "8px"
          }}
        >
          <p><strong>Emergency:</strong> {req.emergencyType}</p>
          <p><strong>Status:</strong> {req.status}</p>
          <p><strong>Patient Location:</strong> {req.lat}, {req.lng}</p>

          <button
            onClick={() => acknowledgeRequest(req.id)}
            style={{
              padding: "8px",
              backgroundColor: "#27ae60",
              color: "white",
              border: "none",
              borderRadius: "5px"
            }}
          >
            ✅ Acknowledge & Prepare
          </button>
        </div>
      ))}
    </div>
  );
}

export default Admin;
