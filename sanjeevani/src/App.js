import User from "./User";
import Admin from "./Admin";
import Login from "./login";
import HospitalPortal from "./HospitalPortal";
import { useState } from "react";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import "./App.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(null);
  const [currentHospitalId, setCurrentHospitalId] = useState(null);

  const handleLogout = async () => {
    await signOut(auth);
    setLoggedIn(null);
    setCurrentHospitalId(null);
  };

  // If not logged in, show login page
  if (!loggedIn) {
    return <Login setLoggedIn={setLoggedIn} setHospitalId={setCurrentHospitalId} />;
  }

  // Route based on user role
  if (loggedIn === "admin") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0f172a" }}>
        <header className="header">
          <div className="header-content">
            <h1 className="header-title">
              🏥 Sanjeevani – Hospital Admin Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="btn btn-outline"
            >
              🚪 Logout
            </button>
          </div>
        </header>
        <main className="main-content">
          <Admin />
        </main>
      </div>
    );
  }

  if (loggedIn === "hospital") {
    return <HospitalPortal hospitalId={currentHospitalId} onLogout={handleLogout} />;
  }

  // User view (with sidebar)
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "var(--color-background)", overflow: "hidden" }}>
      <header className="header">
        <div className="header-content">
          <h1 className="header-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            🏥 Sanjeevani – Emergency Hospital Finder
          </h1>
          <button
            onClick={handleLogout}
            className="btn btn-outline"
          >
            🚪 Logout
          </button>
        </div>
      </header>
      <main style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <User />
      </main>
    </div>
  );
}

export default App;
