import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";

function Admin() {
  const [requests, setRequests] = useState([]);
  const [tips, setTips] = useState({});

  // 🔴 READ EMERGENCY REQUESTS LIVE
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "emergencyRequests"), (snap) => {
      setRequests(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // 🩺 SEND FIRST-AID TIP
  const sendTip = async (req) => {
    const message = tips[req.id];
    if (!message) return alert("Enter first-aid tip");

    await addDoc(collection(db, "firstAidTips"), {
      emergencyId: req.id,
      hospitalId: req.hospitalId,
      message,
      timestamp: serverTimestamp()
    });

    await updateDoc(doc(db, "emergencyRequests", req.id), {
      status: "Hospital Responded"
    });

    setTips({ ...tips, [req.id]: "" });
    alert("First-aid tip sent");
  };

  return (
    <div>
      <h2>🏥 Hospital Admin Dashboard</h2>

      {requests.length === 0 && <p>No emergencies yet</p>}

      {requests.map(req => (
        <div key={req.id} style={{
          border: "1px solid #ccc",
          padding: 12,
          marginBottom: 10,
          borderRadius: 6
        }}>
          <p><b>Emergency:</b> {req.emergencyType}</p>
          <p><b>Status:</b> {req.status}</p>

          <textarea
            placeholder="Enter first-aid instruction..."
            value={tips[req.id] || ""}
            onChange={e =>
              setTips({ ...tips, [req.id]: e.target.value })
            }
            style={{ width: "100%" }}
          />

          <button
            onClick={() => sendTip(req)}
            style={{
              marginTop: 6,
              padding: 8,
              backgroundColor: "#27ae60",
              color: "white",
              border: "none",
              borderRadius: 5
            }}
          >
            📤 Send Tip
          </button>
        </div>
      ))}
    </div>
  );
}

export default Admin;
