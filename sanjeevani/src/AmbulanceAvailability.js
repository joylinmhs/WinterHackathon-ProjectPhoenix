import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { motion, AnimatePresence } from "framer-motion";

function AmbulanceAvailability() {
  const [ambulances, setAmbulances] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => alert("Location permission required")
    );
  }, []);

  useEffect(() => {
    async function fetchAmbulances() {
      const snap = await getDocs(collection(db, "ambulances"));
      setAmbulances(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    fetchAmbulances();
  }, []);

  const distance = (a, b, c, d) => {
    const R = 6371;
    const dLat = (c - a) * Math.PI / 180;
    const dLon = (d - b) * Math.PI / 180;
    const x = Math.sin(dLat / 2) ** 2 +
      Math.cos(a * Math.PI / 180) *
      Math.cos(c * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  };

  const requestAmbulance = async (ambulance) => {
    if (!userLocation) return alert("Location not available");

    await addDoc(collection(db, "ambulanceRequests"), {
      ambulanceId: ambulance.id,
      lat: userLocation.lat,
      lng: userLocation.lng,
      status: "Requested",
      timestamp: serverTimestamp()
    });
    alert("Ambulance requested successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6 md:p-10 font-sans text-gray-200">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-3">
            <span className="text-5xl drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">🚑</span>
            Ambulance Availability
          </h2>
          <p className="text-slate-400 text-lg">Find and request nearest emergency transport</p>
        </motion.div>

        {!userLocation && (
          <div className="flex justify-center mb-8">
            <div className="bg-blue-500/20 text-blue-300 px-6 py-3 rounded-full flex items-center gap-3 border border-blue-500/30 animate-pulse">
              <span className="h-2 w-2 bg-blue-400 rounded-full animate-ping"></span>
              Acquiring precise GPS location...
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {ambulances.map((ambulance, index) => {
              const dist = userLocation ? distance(userLocation.lat, userLocation.lng, ambulance.lat, ambulance.lng) : 0;

              return (
                <motion.div
                  key={ambulance.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700 relative overflow-hidden group"
                >
                  {/* Decorative Gradient Blob */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-500" />

                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{ambulance.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-slate-400">
                        <span>📍</span>
                        <span className="truncate max-w-[150px]">{ambulance.location}</span>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 ${ambulance.available
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}>
                      <span className={`w-2 h-2 rounded-full ${ambulance.available ? 'bg-emerald-400' : 'bg-red-400'}`} />
                      {ambulance.available ? "AVAILABLE" : "BUSY"}
                    </div>
                  </div>

                  <div className="bg-slate-900/50 rounded-xl p-4 mb-6 border border-slate-700/50 relative z-10">
                    <p className="text-slate-300 flex items-center gap-3 mb-2">
                      <span className="bg-slate-800 p-1.5 rounded-lg text-blue-400">📞</span>
                      {ambulance.phone}
                    </p>
                    {userLocation && (
                      <p className="text-slate-300 flex items-center gap-3">
                        <span className="bg-slate-800 p-1.5 rounded-lg text-purple-400">📏</span>
                        <span>{dist.toFixed(2)} km away</span>
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => requestAmbulance(ambulance)}
                    disabled={!ambulance.available}
                    className={`w-full py-3 rounded-xl font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 relative z-10 overflow-hidden
                      ${ambulance.available
                        ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20 hover:shadow-blue-600/40"
                        : "bg-slate-700 text-slate-500 cursor-not-allowed"
                      }`}
                  >
                    {ambulance.available ? (
                      <>
                        <span className="text-lg">🚑</span> Request Now
                      </>
                    ) : (
                      "Unavailable"
                    )}
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {ambulances.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-slate-800/50 rounded-3xl border border-dashed border-slate-700 mt-10"
          >
            <div className="text-6xl mb-4 grayscale opacity-50">🚑</div>
            <p className="text-slate-500 text-xl font-light">No ambulances found in the network.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default AmbulanceAvailability;