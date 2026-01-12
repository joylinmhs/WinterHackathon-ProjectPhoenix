import { useState } from "react";

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
    <div style={sidebarStyle}>
      <div style={sidebarHeaderStyle}>
        <h3 style={{ margin: "0", color: "#1976d2", fontSize: "18px" }}>
          🏥 Sanjeevani Services
        </h3>
        <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "12px" }}>
          Emergency Healthcare
        </p>
      </div>

      <div style={menuContainerStyle}>
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            style={{
              ...menuItemStyle,
              backgroundColor: currentPage === item.id ? "#e3f2fd" : "transparent",
              borderLeft: currentPage === item.id ? "4px solid #1976d2" : "4px solid transparent"
            }}
          >
            <div style={menuIconStyle}>{item.icon}</div>
            <div style={menuContentStyle}>
              <div style={menuTitleStyle}>{item.name}</div>
              <div style={menuDescriptionStyle}>{item.description}</div>
            </div>
          </button>
        ))}
      </div>

      <div style={emergencyContactStyle}>
        <h4 style={{ margin: "0 0 10px 0", color: "#d32f2f", fontSize: "14px" }}>
          🚨 Emergency Contacts
        </h4>
        <div style={contactItemStyle}>
          <span style={{ fontWeight: "bold" }}>Ambulance:</span> 108
        </div>
        <div style={contactItemStyle}>
          <span style={{ fontWeight: "bold" }}>Police:</span> 100
        </div>
        <div style={contactItemStyle}>
          <span style={{ fontWeight: "bold" }}>Fire:</span> 101
        </div>
      </div>
    </div>
  );
}

const sidebarStyle = {
  width: "250px",
  height: "calc(100vh - 80px)",
  backgroundColor: "#ffffff",
  borderRight: "1px solid #e0e0e0",
  padding: "20px",
  overflowY: "auto",
  boxShadow: "2px 0 8px rgba(0,0,0,0.1)"
};

const sidebarHeaderStyle = {
  marginBottom: "30px",
  paddingBottom: "15px",
  borderBottom: "1px solid #e0e0e0"
};

const menuContainerStyle = {
  marginBottom: "30px"
};

const menuItemStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  padding: "15px",
  marginBottom: "8px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  textAlign: "left",
  transition: "all 0.3s ease",
  backgroundColor: "transparent"
};

const menuIconStyle = {
  fontSize: "24px",
  marginRight: "12px",
  minWidth: "24px"
};

const menuContentStyle = {
  flex: 1
};

const menuTitleStyle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#333",
  marginBottom: "2px"
};

const menuDescriptionStyle = {
  fontSize: "12px",
  color: "#666",
  lineHeight: "1.3"
};

const emergencyContactStyle = {
  backgroundColor: "#ffeaea",
  padding: "15px",
  borderRadius: "8px",
  border: "1px solid #ffcccc"
};

const contactItemStyle = {
  fontSize: "13px",
  color: "#d32f2f",
  marginBottom: "5px"
};

export default Sidebar;