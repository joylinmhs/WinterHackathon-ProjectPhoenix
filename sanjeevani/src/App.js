import User from "./User";
import Admin from "./Admin";
import Login from "./login";
import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";

function App() {
  const [loggedIn, setLoggedIn] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    setLoggedIn(null);
  };

  // Show loading state
  if (loading) {
    return (
      <div style={loadingScreenStyle}>
        <div style={{ textAlign: "center" }}>
          <h2>🏥 Sanjeevani</h2>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If not logged in, show login page
  if (!loggedIn) {
    return <Login setLoggedIn={setLoggedIn} />;
  }

  // Route based on user role
  if (loggedIn === "admin") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
        <div style={headerStyle}>
          <div style={headerContentStyle}>
            <h1 style={{ textAlign: "left", color: "#d32f2f", fontSize: "24px", margin: 0 }}>
              🏥 Sanjeevani – Hospital Admin Dashboard
            </h1>
            <button
              onClick={handleLogout}
              style={{
                ...navButtonStyle,
                backgroundColor: "#f5f5f5",
                color: "#666",
                fontWeight: "600"
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>
        <div style={mainContentStyle}>
          <Admin />
        </div>
      </div>
    );
  }

  // User view (with sidebar)
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <div style={headerStyle}>
        <div style={headerContentStyle}>
          <h1 style={{ textAlign: "left", color: "#1976d2", fontSize: "24px", margin: 0 }}>
            🏥 Sanjeevani – Emergency Hospital Finder
          </h1>
          <button
            onClick={handleLogout}
            style={{
              ...navButtonStyle,
              backgroundColor: "#f5f5f5",
              color: "#666",
              fontWeight: "600"
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>
      <div style={userMainContentStyle}>
        <User />
      </div>
    </div>
  );
}

const loadingScreenStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundColor: "#f8f9fa",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
};

const headerStyle = {
  backgroundColor: "#ffffff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  padding: "20px 0",
  borderBottom: "3px solid #1976d2"
};

const headerContentStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const navButtonStyle = {
  padding: "10px 18px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  transition: "all 0.3s ease",
  outline: "none"
};

const mainContentStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "30px 20px"
};

const userMainContentStyle = {
  // No margin needed since User component handles its own layout with sidebar
};

export default App;
