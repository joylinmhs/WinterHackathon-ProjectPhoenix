import React from "react";

function Sidebar({ currentPage, setCurrentPage }) {
  const menuItems = [
    {
      id: "emergency",
      name: "Emergency Hospital",
      icon: "🏥",
      description: "Find nearest hospital"
    },
    {
      id: "ambulance",
      name: "Ambulance",
      icon: "🚑",
      description: "Request ambulance service"
    },
    {
      id: "bloodbank",
      name: "Blood Bank",
      icon: "🩸",
      description: "Blood donation & requests"
    },
    {
      id: "firstaid",
      name: "First Aid Tips",
      icon: "🩹",
      description: "Emergency response guide"
    }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-800 text-gray-200 font-sans border-r border-slate-700">
      <div className="p-6 border-b border-slate-700">
        <h3 className="text-xl font-bold text-blue-400 flex items-center gap-2">
          🏥 <span className="text-white">Sanjeevani</span>
        </h3>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wide font-semibold">Priority Healthcare</p>
      </div>

      <div className="flex-1 px-4 py-6 overflow-y-auto space-y-2">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-center group relative
              ${currentPage === item.id
                ? 'bg-blue-600/20 text-blue-300 shadow-sm ring-1 ring-blue-500/30'
                : 'hover:bg-slate-700 text-slate-400 hover:text-white'
              }`}
          >
            {currentPage === item.id && (
              <div className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            )}
            <div className={`text-2xl mr-4 group-hover:scale-110 transition-transform ${currentPage === item.id ? 'opacity-100' : 'opacity-70'}`}>{item.icon}</div>
            <div className="flex-1">
              <div className={`font-semibold ${currentPage === item.id ? 'text-blue-300' : 'text-slate-200'}`}>
                {item.name}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {item.description}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="p-4 m-4 bg-red-900/10 border border-red-900/30 rounded-2xl shadow-inner">
        <h4 className="text-red-400 font-bold mb-3 flex items-center gap-2 text-sm">
          🚨 Emergency Contacts
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center text-red-300 bg-red-900/20 p-2 rounded-lg border border-red-900/20">
            <span className="font-semibold">Ambulance</span>
            <span className="font-bold font-mono tracking-wider">108</span>
          </div>
          <div className="flex justify-between items-center text-red-300 bg-red-900/20 p-2 rounded-lg border border-red-900/20">
            <span className="font-semibold">Police</span>
            <span className="font-bold font-mono tracking-wider">100</span>
          </div>
          <div className="flex justify-between items-center text-red-300 bg-red-900/20 p-2 rounded-lg border border-red-900/20">
            <span className="font-semibold">Fire</span>
            <span className="font-bold font-mono tracking-wider">101</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;