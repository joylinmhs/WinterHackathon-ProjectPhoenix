import React from "react";
import "./App.css";

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
      icon: "🚑",
      description: "Emergency response guide"
    }
  ];

  return (
    <div>
      <div className="sidebar-header">
        <h3 style={{ margin: "0", color: "var(--color-primary)", fontSize: "18px" }}>
          🏥 Sanjeevani Services
        </h3>
        <p style={{ margin: "5px 0 0 0", color: "var(--color-text-light)", fontSize: "12px" }}>
          Emergency Healthcare
        </p>
      </div>

      <div className="sidebar-menu">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`sidebar-item ${currentPage === item.id ? 'active' : ''}`}
          >
            <div className="sidebar-icon">{item.icon}</div>
            <div className="sidebar-content">
              <div className="sidebar-title">{item.name}</div>
              <div className="sidebar-description">{item.description}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="sidebar-emergency">
        <h4 style={{ margin: "0 0 10px 0", color: "var(--color-error)", fontSize: "14px" }}>
          🚨 Emergency Contacts
        </h4>
        <div className="sidebar-contact">
          <span style={{ fontWeight: "bold" }}>Ambulance:</span> 108
        </div>
        <div className="sidebar-contact">
          <span style={{ fontWeight: "bold" }}>Police:</span> 100
        </div>
        <div className="sidebar-contact">
          <span style={{ fontWeight: "bold" }}>Fire:</span> 101
        </div>
      </div>
    </div>
  );
}

export default Sidebar;