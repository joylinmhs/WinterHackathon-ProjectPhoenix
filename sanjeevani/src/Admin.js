import { useEffect, useState } from "react";
import { query, where } from "firebase/firestore";

import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";

function Admin() {
  const [requests, setRequests] = useState([]);
  const [tips, setTips] = useState({});

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

  const sendTip = async (req) => {
    const message = tips[req.id];
    if (!message) return alert("Enter first-aid instruction");

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
    alert("Tip sent to patient");
  };

  return (
    <div>
      <h2>🏥 Hospital Admin Dashboard</h2>

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


          <textarea
            placeholder="Enter first-aid instruction..."
            value={tips[req.id] || ""}
            onChange={e => setTips({ ...tips, [req.id]: e.target.value })}
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
            📤 Send First-Aid Tip
          </button>
        </div>
      ))}
    </div>
  );
}

export default Admin;
