import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  query,
  where
} from "firebase/firestore";
import { db } from "./firebase";
import { motion, AnimatePresence } from "framer-motion";

function Admin() {
  const [activeTab, setActiveTab] = useState("bloodbanks");
  const [bloodBanks, setBloodBanks] = useState([]);
  const [donors, setDonors] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  // New blood bank form
  const [newBloodBank, setNewBloodBank] = useState({
    name: "", location: "", phone: "", hours: "",
    bloodTypes: { "A+": 0, "A-": 0, "B+": 0, "B-": 0, "AB+": 0, "AB-": 0, "O+": 0, "O-": 0 }
  });

  // New donor form
  const [newDonor, setNewDonor] = useState({
    name: "", bloodType: "", phone: "", location: ""
  });

  // New hospital form
  const [newHospital, setNewHospital] = useState({
    name: "", lat: "", lng: "", icuBeds: "", oxygen: false, doctors: false, email: "", password: ""
  });

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

  // Add new blood bank
  const addBloodBank = async () => {
    if (!newBloodBank.name || !newBloodBank.location || !newBloodBank.phone) {
      return alert("Please fill all fields");
    }
    await addDoc(collection(db, "bloodBanks"), newBloodBank);
    setNewBloodBank({
      name: "", location: "", phone: "", hours: "",
      bloodTypes: { "A+": 0, "A-": 0, "B+": 0, "B-": 0, "AB+": 0, "AB-": 0, "O+": 0, "O-": 0 }
    });
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
    setNewHospital({ name: "", lat: "", lng: "", icuBeds: "", oxygen: false, doctors: false, email: "", password: "" });
    alert("Hospital added successfully");
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

  const tabs = [
    { id: "bloodbanks", label: "Manage Blood Banks", icon: "🩸", color: "red" }, // changed color to red for consistency
    { id: "donors", label: "Manage Donors", icon: "💉", color: "orange" },
    { id: "hospitals", label: "Manage Hospitals", icon: "🏥", color: "purple" }
  ];

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-gray-200">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2 flex items-center justify-center gap-3"
          >
            <span className="text-5xl drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">🏥</span>
            Hospital Admin Dashboard
          </motion.h1>
          <p className="text-slate-400 text-lg">Manage healthcare services and emergency responses</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center p-2 bg-slate-800 rounded-2xl shadow-lg border border-slate-700">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 relative
                ${activeTab === tab.id
                  ? `text-${tab.color}-400 bg-slate-700` // Highlighted
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
            >
              {activeTab === tab.id && ( // Active Tab Background Glow
                <motion.div
                  layoutId="activeTab"
                  className={`absolute inset-0 rounded-xl bg-${tab.color}-500/10 border border-${tab.color}-500/30 shadow-[0_0_10px_rgba(0,0,0,0.2)]`}
                />
              )}
              <span className="relative z-10">{tab.icon}</span>
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-slate-800/50 rounded-2xl shadow-2xl p-6 border border-slate-700 backdrop-blur-sm min-h-[600px]">
          <AnimatePresence mode="wait">

            {/* Blood Banks Tab */}
            {activeTab === "bloodbanks" && (
              <motion.div
                key="bloodbanks"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-red-400 mb-6 flex items-center gap-2">
                  <span className="text-3xl">🩸</span> Manage Blood Banks
                </h2>

                <div className="bg-slate-800 p-6 rounded-xl mb-8 border border-slate-700 shadow-inner">
                  <h3 className="text-lg font-semibold text-red-300 mb-4 border-b border-slate-700 pb-2">Add New Bank</h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <input type="text" placeholder="Blood Bank Name" value={newBloodBank.name} onChange={e => setNewBloodBank({ ...newBloodBank, name: e.target.value })} className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-red-500 outline-none" />
                    <input type="text" placeholder="Location" value={newBloodBank.location} onChange={e => setNewBloodBank({ ...newBloodBank, location: e.target.value })} className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-red-500 outline-none" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <input type="tel" placeholder="Phone Number" value={newBloodBank.phone} onChange={e => setNewBloodBank({ ...newBloodBank, phone: e.target.value })} className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-red-500 outline-none" />
                    <input type="text" placeholder="Operating Hours (e.g. 24/7)" value={newBloodBank.hours} onChange={e => setNewBloodBank({ ...newBloodBank, hours: e.target.value })} className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-red-500 outline-none" />
                  </div>

                  {/* Blood Types Inventory Inputs */}
                  <h4 className="text-sm font-semibold text-slate-400 mb-2">Available Units</h4>
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    {Object.keys(newBloodBank.bloodTypes).map((type) => (
                      <div key={type} className="flex flex-col">
                        <label className="text-xs text-slate-500 mb-1">{type}</label>
                        <input
                          type="number"
                          value={newBloodBank.bloodTypes[type]}
                          onChange={(e) => setNewBloodBank({ ...newBloodBank, bloodTypes: { ...newBloodBank.bloodTypes, [type]: parseInt(e.target.value) || 0 } })}
                          className="px-2 py-2 bg-slate-900 border border-slate-700 rounded text-white text-center focus:ring-1 focus:ring-red-500 outline-none"
                        />
                      </div>
                    ))}
                  </div>

                  <button onClick={addBloodBank} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg shadow-red-600/20">➕ Add Blood Bank</button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {bloodBanks.map(bb => (
                    <div key={bb.id} className="bg-slate-800 border border-slate-700 p-5 rounded-xl shadow-md flex justify-between items-start hover:border-red-500/50 transition-colors">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white mb-2">{bb.name}</h4>
                        <div className="space-y-1 text-sm text-slate-400">
                          <p>📍 {bb.location}</p>
                          <p>📞 {bb.phone}</p>
                          <p>🕒 {bb.hours}</p>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {bb.bloodTypes && Object.entries(bb.bloodTypes).filter(([_, qty]) => qty > 0).map(([type, qty]) => (
                            <span key={type} className="text-xs bg-red-900/30 text-red-300 px-1.5 py-0.5 rounded border border-red-900/50">
                              {type}: {qty}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button onClick={() => deleteBloodBank(bb.id)} className="text-slate-500 hover:text-red-400 p-2 hover:bg-slate-700 rounded bg-slate-900/50">🗑️</button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Donors Tab */}
            {activeTab === "donors" && (
              <motion.div
                key="donors"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-orange-400 mb-6 flex items-center gap-2">
                  <span className="text-3xl">💉</span> Manage Donors
                </h2>

                <div className="bg-slate-800 p-6 rounded-xl mb-8 border border-slate-700 shadow-inner">
                  <h3 className="text-lg font-semibold text-orange-300 mb-4 border-b border-slate-700 pb-2">Register Donor</h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <input type="text" placeholder="Donor Name" value={newDonor.name} onChange={e => setNewDonor({ ...newDonor, name: e.target.value })} className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 outline-none" />
                    <select value={newDonor.bloodType} onChange={e => setNewDonor({ ...newDonor, bloodType: e.target.value })} className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 outline-none">
                      <option value="">Select Blood Type</option>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <input type="tel" placeholder="Phone" value={newDonor.phone} onChange={e => setNewDonor({ ...newDonor, phone: e.target.value })} className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 outline-none" />
                    <input type="text" placeholder="Location" value={newDonor.location} onChange={e => setNewDonor({ ...newDonor, location: e.target.value })} className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 outline-none" />
                  </div>
                  <button onClick={addDonor} className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg shadow-orange-600/20">➕ Add Donor</button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {donors.map(donor => (
                    <div key={donor.id} className="bg-slate-800 border border-slate-700 p-5 rounded-xl shadow-md hover:border-orange-500/50 transition-colors relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-2 bg-slate-900/50 rounded-bl-xl border-b border-l border-slate-700">
                        <span className="text-xl font-bold text-orange-400 font-mono">{donor.bloodType}</span>
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2 pr-10">{donor.name}</h4>
                      <div className="text-sm text-slate-400 space-y-1 mb-4">
                        <p>📞 {donor.phone}</p>
                        <p>📍 {donor.location}</p>
                      </div>
                      <button onClick={() => deleteDonor(donor.id)} className="w-full py-2 bg-slate-900 text-slate-500 hover:text-red-400 rounded hover:bg-slate-700 transition-colors border border-slate-700">Delete</button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Hospitals Tab */}
            {activeTab === "hospitals" && (
              <motion.div
                key="hospitals"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-purple-400 mb-6 flex items-center gap-2">
                  <span className="text-3xl">🏥</span> Manage Hospitals
                </h2>

                <div className="bg-slate-800 p-6 rounded-xl mb-8 border border-slate-700 shadow-inner">
                  <h3 className="text-lg font-semibold text-purple-300 mb-4 border-b border-slate-700 pb-2">Add New Facility</h3>
                  <div className="flex gap-4 mb-4">
                    <input type="text" placeholder="Hospital Name" value={newHospital.name} onChange={e => setNewHospital({ ...newHospital, name: e.target.value })} className="flex-[2] px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 outline-none" />
                    <input type="email" placeholder="Login Email" value={newHospital.email} onChange={e => setNewHospital({ ...newHospital, email: e.target.value })} className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 outline-none" />
                    <input type="text" placeholder="Password" value={newHospital.password} onChange={e => setNewHospital({ ...newHospital, password: e.target.value })} className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 outline-none" />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <input type="number" step="any" placeholder="Latitude" value={newHospital.lat} onChange={e => setNewHospital({ ...newHospital, lat: e.target.value })} className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 outline-none" />
                    <input type="number" step="any" placeholder="Longitude" value={newHospital.lng} onChange={e => setNewHospital({ ...newHospital, lng: e.target.value })} className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 outline-none" />
                    <input type="number" placeholder="ICU Beds" value={newHospital.icuBeds} onChange={e => setNewHospital({ ...newHospital, icuBeds: e.target.value })} className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 outline-none" />
                  </div>
                  <div className="flex gap-6 mb-6">
                    <label className="flex items-center text-slate-300 cursor-pointer">
                      <input type="checkbox" checked={newHospital.oxygen} onChange={e => setNewHospital({ ...newHospital, oxygen: e.target.checked })} className="w-5 h-5 rounded bg-slate-700 border-slate-500 text-purple-600 focus:ring-purple-500" />
                      <span className="ml-2">Oxygen</span>
                    </label>
                    <label className="flex items-center text-slate-300 cursor-pointer">
                      <input type="checkbox" checked={newHospital.doctors} onChange={e => setNewHospital({ ...newHospital, doctors: e.target.checked })} className="w-5 h-5 rounded bg-slate-700 border-slate-500 text-purple-600 focus:ring-purple-500" />
                      <span className="ml-2">Doctors</span>
                    </label>
                  </div>
                  <button onClick={addHospital} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg shadow-purple-600/20">➕ Add Hospital</button>
                </div>

                <div className="grid gap-4">
                  {hospitals.map(hosp => (
                    <div key={hosp.id} className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-md hover:border-purple-500/50 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h4 className="text-xl font-bold text-white mb-2">{hosp.name}</h4>
                        <div className="mb-2 text-sm text-slate-500">
                          📧 {hosp.email} | 🔑 {hosp.password}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                          <span className="bg-slate-900 px-2 py-1 rounded border border-slate-700">📍 {hosp.lat}, {hosp.lng}</span>
                          <span className="bg-slate-900 px-2 py-1 rounded border border-slate-700">🛏️ ICU: {hosp.icuBeds}</span>
                          <span className={hosp.oxygen ? "text-emerald-400" : "text-slate-600"}>{hosp.oxygen ? "✅ Oxygen" : "❌ Oxygen"}</span>
                          <span className={hosp.doctors ? "text-emerald-400" : "text-slate-600"}>{hosp.doctors ? "✅ Doctors" : "❌ Doctors"}</span>
                        </div>
                      </div>
                      <button onClick={() => deleteHospital(hosp.id)} className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg border border-red-500/20 transition-all">Delete</button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default Admin;
