import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { motion, AnimatePresence } from "framer-motion";

function BloodBank() {
  const [bloodBanks, setBloodBanks] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedBloodType, setSelectedBloodType] = useState("");

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => alert("Location permission required")
    );
  }, []);

  useEffect(() => {
    async function fetchBloodBanks() {
      const snap = await getDocs(collection(db, "bloodBanks"));
      setBloodBanks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    fetchBloodBanks();
  }, []);

  const distance = (a, b, c, d) => {
    if ([a, b, c, d].some(val => val === undefined || val === null || isNaN(val))) return NaN;
    const R = 6371;
    const dLat = (c - a) * Math.PI / 180;
    const dLon = (d - b) * Math.PI / 180;
    const x = Math.sin(dLat / 2) ** 2 +
      Math.cos(a * Math.PI / 180) *
      Math.cos(c * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  };

  const requestBlood = async (bloodBank, bloodType) => {
    if (!userLocation || !bloodType) return alert("Please select blood type and ensure location is available");

    const quantity = bloodBank.bloodTypes && bloodBank.bloodTypes[bloodType] ? bloodBank.bloodTypes[bloodType] : 0;
    if (quantity <= 0) {
      return alert(`Sorry, ${bloodType} is currently unavailable at ${bloodBank.name}.`);
    }

    await addDoc(collection(db, "bloodRequests"), {
      bloodBankId: bloodBank.id,
      bloodType: bloodType,
      lat: userLocation.lat,
      lng: userLocation.lng,
      status: "Requested",
      timestamp: serverTimestamp()
    });
    alert(`Blood ${bloodType} requested from ${bloodBank.name}!`);
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6 md:p-10 font-sans text-gray-200">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-rose-400 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-3">
            <span className="text-5xl drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">🩸</span>
            Blood Bank Services
          </h2>
          <p className="text-slate-400 text-lg">Locate blood banks and request specific blood types</p>
        </motion.div>

        {!userLocation && (
          <div className="flex justify-center mb-8">
            <div className="bg-red-500/20 text-red-300 px-6 py-3 rounded-full flex items-center gap-3 border border-red-500/30 animate-pulse">
              <span className="h-2 w-2 bg-red-400 rounded-full animate-ping"></span>
              Locating nearest facilities...
            </div>
          </div>
        )}

        {/* Blood Type Selector */}
        <div className="mb-10 flex justify-center">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl max-w-2xl w-full">
            <label className="block mb-4 font-bold text-slate-300 text-center text-lg">
              Which blood type do you need?
            </label>
            <div className="flex flex-wrap gap-3 justify-center">
              {bloodTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedBloodType(type)}
                  className={`px-5 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 border-2
                                ${selectedBloodType === type
                      ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/30'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-red-500/50 hover:text-red-400'
                    }
                            `}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          <AnimatePresence>
            {bloodBanks.map((bloodBank, index) => {
              const rawDist = userLocation ? distance(userLocation.lat, userLocation.lng, bloodBank.lat, bloodBank.lng) : null;
              const dist = isNaN(rawDist) ? null : rawDist;

              const quantity = selectedBloodType && bloodBank.bloodTypes ? (bloodBank.bloodTypes[selectedBloodType] || 0) : 0;
              const isAvailable = selectedBloodType && quantity > 0;

              return (
                <motion.div
                  key={bloodBank.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700 relative overflow-hidden flex flex-col hover:border-red-500/30 transition-all duration-300"
                >
                  {/* Decorative Splash */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{bloodBank.name}</h3>
                      <div className="text-sm text-slate-400 space-y-1">
                        <p className="flex items-center gap-2"><span>📍</span> {bloodBank.location}</p>
                        <p className="flex items-center gap-2"><span>📞</span> {bloodBank.phone}</p>
                        <p className="flex items-center gap-2"><span>⏰</span> {bloodBank.hours}</p>
                      </div>
                    </div>
                    {dist !== null && (
                      <div className="bg-slate-900 px-3 py-1 rounded-lg border border-slate-700 text-slate-300 text-sm font-mono">
                        {dist.toFixed(1)} km
                      </div>
                    )}
                  </div>

                  {/* Blood Type Availability Grid */}
                  <div className="flex-1 mb-6">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Inventory Status</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {bloodTypes.map(type => {
                        const available = bloodBank.bloodTypes && bloodBank.bloodTypes[type];
                        return (
                          <div key={type} className={`text-center p-2 rounded-lg border text-xs font-medium transition-colors
                             ${available
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                              : 'bg-slate-900/50 border-slate-700 text-slate-600'
                            }`}>
                            <div className="font-bold text-sm">{type}</div>
                            <div>{available || 0}u</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => requestBlood(bloodBank, selectedBloodType)}
                    disabled={!isAvailable}
                    className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2
                      ${isAvailable
                        ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-600/20 hover:shadow-red-600/40 transform hover:-translate-y-1"
                        : "bg-slate-700 text-slate-500 cursor-not-allowed border border-slate-600"
                      }`}
                  >
                    {selectedBloodType
                      ? (quantity > 0 ? <><span>🩸</span> Request {selectedBloodType} Blood</> : "Out of Stock")
                      : "Select Type to Request"
                    }
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {bloodBanks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-slate-800/50 rounded-3xl border border-dashed border-slate-700 mt-10"
          >
            <div className="text-6xl mb-4 grayscale opacity-50">🩸</div>
            <p className="text-slate-500 text-xl font-light">No blood banks found in the registry.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default BloodBank;