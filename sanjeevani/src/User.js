import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import Sidebar from "./Sidebar";
import AmbulanceAvailability from "./AmbulanceAvailability";
import BloodBank from "./BloodBank";
import FirstAidTips from "./FirstAidTips";
import { motion, AnimatePresence } from "framer-motion";

function User() {
  const [currentPage, setCurrentPage] = useState("emergency");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hospitals, setHospitals] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [bestHospital, setBestHospital] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => alert("Location permission required")
    );
  }, []);

  useEffect(() => {
    async function fetchHospitals() {
      const snap = await getDocs(collection(db, "hospitals"));
      setHospitals(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    fetchHospitals();
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

  useEffect(() => {
    if (!userLocation || hospitals.length === 0) return;

    const ranked = hospitals.map(h => ({
      ...h,
      distance: distance(userLocation.lat, userLocation.lng, h.lat, h.lng)
    }))
      .filter(h => h.distance <= 200 && h.icuBeds > 0 && h.oxygen && h.doctors)
      .sort((a, b) => a.distance - b.distance);

    setBestHospital(ranked[0] || null);
  }, [userLocation, hospitals]);

  const notifyHospital = async () => {
    if (!bestHospital) return;

    await addDoc(collection(db, "emergencyRequests"), {
      hospitalId: bestHospital.id,
      lat: userLocation.lat,
      lng: userLocation.lng,
      status: "Pending",
      timestamp: serverTimestamp()
    });
    alert("Hospital notified");
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "emergency":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="p-6 max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <motion.h2
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-2 flex items-center justify-center gap-3 drop-shadow-lg"
              >
                <span className="text-4xl filter drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">🚑</span> Emergency Hospital Finder
              </motion.h2>
              <p className="text-slate-400">Locating the nearest available emergency care...</p>
            </div>

            {!userLocation && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative w-24 h-24 mb-6">
                  <motion.div
                    className="absolute inset-0 bg-red-500 rounded-full opacity-20 blur-md"
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute inset-0 m-auto w-4 h-4 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,1)]"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <div className="absolute inset-0 border-2 border-red-500/30 rounded-full animate-ping" />
                </div>
                <p className="text-lg text-red-400 font-medium animate-pulse">Acquiring GPS Signal...</p>
              </div>
            )}

            {userLocation && bestHospital && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white flex justify-between items-center shadow-lg">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <span>🏥</span> Best Match Found
                  </h3>
                  <span className="px-3 py-1 bg-black/20 rounded-full text-sm backdrop-blur-sm border border-white/10 font-mono">
                    {bestHospital.distance.toFixed(2)} km away
                  </span>
                </div>

                <div className="p-8">
                  <div className="mb-6">
                    <h4 className="text-3xl font-bold text-white mb-2">{bestHospital.name}</h4>
                    <div className="flex gap-4 mt-6">
                      <div className="bg-slate-700/50 border border-slate-600 px-4 py-3 rounded-xl flex flex-col items-center flex-1 backdrop-blur-sm">
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">ICU Beds</span>
                        <span className="text-2xl font-bold text-white">{bestHospital.icuBeds}</span>
                      </div>
                      <div className="bg-slate-700/50 border border-slate-600 px-4 py-3 rounded-xl flex flex-col items-center flex-1 backdrop-blur-sm">
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Oxygen</span>
                        <span className="text-2xl font-bold text-white">Yes</span>
                      </div>
                      <div className="bg-slate-700/50 border border-slate-600 px-4 py-3 rounded-xl flex flex-col items-center flex-1 backdrop-blur-sm">
                        <span className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">Doctors</span>
                        <span className="text-2xl font-bold text-white">Yes</span>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={notifyHospital}
                    className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold py-4 px-6 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.4)] flex items-center justify-center gap-3 transition-colors text-lg border border-red-400/20"
                  >
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-2xl"
                    >
                      🚨
                    </motion.span>
                    NOTIFY HOSPITAL IMMEDIATELY
                  </motion.button>
                  <p className="text-center text-xs text-slate-500 mt-4">
                    This will send a high-priority emergency alert to the hospital dashboard.
                  </p>
                </div>
              </motion.div>
            )}

            {!bestHospital && userLocation && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-yellow-900/10 border-l-4 border-yellow-500 p-6 rounded-r-xl"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="text-3xl">⚠️</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-yellow-500">No Suitable Hospital Found</h3>
                    <div className="mt-2 text-yellow-600/80">
                      <p>We couldn't find a hospital meeting all logical criteria within 200km.</p>
                      <button
                        className="mt-4 bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-lg font-medium hover:bg-yellow-500/30 transition-colors border border-yellow-500/30"
                        onClick={() => setCurrentPage("ambulance")}
                      >
                        Try Ambulance Service →
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        );
      case "ambulance":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 text-white"
          >
            <AmbulanceAvailability />
          </motion.div>
        );
      case "bloodbank":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 text-white"
          >
            <BloodBank />
          </motion.div>
        );
      case "firstaid":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 text-white"
          >
            <FirstAidTips />
          </motion.div>
        );
      default:
        return <div className="text-white">Page not found</div>;
    }
  };

  return (
    <div className="flex h-full bg-slate-900 overflow-hidden font-sans">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-full bg-slate-800 border-r border-slate-700 z-20 relative hidden md:block"
          >
            <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="md:hidden fixed inset-y-0 left-0 w-72 bg-slate-800 z-50 shadow-2xl border-r border-slate-700"
          >
            <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-900">
        {/* Header/Toggle for Mobile */}
        <div className="md:hidden p-4 bg-slate-800 shadow-sm flex items-center gap-3 z-10 transition-all border-b border-slate-700">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors text-white"
          >
            <span className="text-xl">☰</span>
          </button>
          <span className="font-bold text-white">Sanjeevani</span>
        </div>

        {/* Desktop Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`absolute top-6 z-30 p-2 bg-slate-800 rounded-full shadow-lg border border-slate-700 hover:bg-slate-700 transition-all duration-300 hidden md:flex items-center justify-center w-10 h-10 text-slate-300 hover:text-white
            ${sidebarOpen ? 'left-[-20px] ml-[290px]' : 'left-4'}`}
          title="Toggle Sidebar"
        >
          {sidebarOpen ? '◀' : '▶'}
        </button>

        <main className="flex-1 overflow-y-auto bg-slate-900 relative">
          <div className="max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              {renderCurrentPage()}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

export default User;
