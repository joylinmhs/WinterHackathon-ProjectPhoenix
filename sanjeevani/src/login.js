import { useState } from "react";

function Login({ setLoggedIn }) {
  const [step, setStep] = useState("roleSelection"); // roleSelection, adminPassword
  const [adminPassword, setAdminPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const ADMIN_PASSWORD = "admin123"; // Change this to your desired password

  const handleUserClick = () => {
    setLoggedIn("user");
  };

  const handleAdminClick = () => {
    setStep("adminPassword");
  };

  const handleAdminPasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate async check (you can add backend verification here)
    setTimeout(() => {
      if (adminPassword === ADMIN_PASSWORD) {
        setLoggedIn("admin");
      } else {
        setError("Incorrect password. Please try again.");
        setAdminPassword("");
      }
      setLoading(false);
    }, 500);
  };

  const handleBackClick = () => {
    setStep("roleSelection");
    setAdminPassword("");
    setError("");
  };

  return (
    <div style={containerStyle}>
      {/* Left Side - Branding & Info */}
      <div style={leftPanelStyle}>
        <div style={brandingStyle}>
          <h1 style={{ fontSize: "48px", margin: "0 0 20px 0" }}>🏥</h1>
          <h2 style={{ 
            fontSize: "36px", 
            margin: "0 0 15px 0", 
            fontWeight: "700",
            color: "#ffffff"
          }}>
            Sanjeevani
          </h2>
          <p style={{ 
            fontSize: "18px", 
            margin: "0 0 30px 0", 
            color: "#e0e0e0",
            fontWeight: "300"
          }}>
            Smart Emergency Hospital Finder
          </p>
          <p style={{ 
            fontSize: "14px", 
            color: "#b0bec5",
            lineHeight: "1.8"
          }}>
            Connecting patients with emergency medical assistance in critical moments. Secure, reliable, and life-saving.
          </p>
        </div>
      </div>

      {/* Right Side - Content */}
      <div style={rightPanelStyle}>
        <div style={formContainerStyle}>
          {step === "roleSelection" ? (
            <>
              <h2 style={{ 
                textAlign: "center", 
                color: "#1976d2", 
                marginBottom: "10px",
                fontSize: "28px",
                fontWeight: "700"
              }}>
                Welcome to Sanjeevani
              </h2>
              <p style={{ 
                textAlign: "center", 
                color: "#757575", 
                marginBottom: "40px",
                fontSize: "14px"
              }}>
                Select your role to continue
              </p>

              <div style={roleButtonsContainerStyle}>
                <button
                  onClick={handleUserClick}
                  style={userButtonStyle}
                >
                  <div style={{ fontSize: "40px", marginBottom: "15px" }}>👤</div>
                  <div style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>
                    Patient
                  </div>
                  <div style={{ fontSize: "13px", color: "#666" }}>
                    Emergency assistance
                  </div>
                </button>

                <button
                  onClick={handleAdminClick}
                  style={adminButtonStyle}
                >
                  <div style={{ fontSize: "40px", marginBottom: "15px" }}>🏢</div>
                  <div style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>
                    Hospital Admin
                  </div>
                  <div style={{ fontSize: "13px", color: "#666" }}>
                    Manage emergencies
                  </div>
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={handleBackClick}
                style={backButtonStyle}
              >
                Back ←
              </button>

              <h2 style={{ 
                textAlign: "center", 
                color: "#d32f2f", 
                marginBottom: "10px",
                fontSize: "28px",
                fontWeight: "700",
                marginTop: "30px"
              }}>
                Admin Access
              </h2>
              <p style={{ 
                textAlign: "center", 
                color: "#757575", 
                marginBottom: "35px",
                fontSize: "14px"
              }}>
                Enter the admin password to continue
              </p>

              <form onSubmit={handleAdminPasswordSubmit}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Admin Password</label>
                  <input
                    type="password"
                    placeholder="Enter admin password"
                    value={adminPassword}
                    required
                    onChange={(e) => setAdminPassword(e.target.value)}
                    style={inputStyle}
                    autoFocus
                  />
                </div>

                {error && (
                  <div style={errorBoxStyle}>
                    <span style={{ marginRight: "8px" }}>⚠️</span>
                    {error}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  style={{
                    ...submitButtonStyle,
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? "not-allowed" : "pointer"
                  }}
                >
                  {loading ? "Verifying..." : "Access Admin Dashboard"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const containerStyle = {
  display: "flex",
  height: "100vh",
  backgroundColor: "#ffffff",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
};

const leftPanelStyle = {
  flex: 1,
  background: "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px",
  color: "white"
};

const brandingStyle = {
  textAlign: "center"
};

const rightPanelStyle = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px",
  backgroundColor: "#f8f9fa"
};

const formContainerStyle = {
  width: "100%",
  maxWidth: "380px",
  position: "relative"
};

const roleButtonsContainerStyle = {
  display: "flex",
  gap: "20px",
  flexDirection: "column"
};

const roleButtonBase = {
  padding: "30px 20px",
  border: "2px solid #e0e0e0",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "14px",
  transition: "all 0.3s ease",
  outline: "none",
  backgroundColor: "#ffffff",
  textAlign: "center"
};

const userButtonStyle = {
  ...roleButtonBase,
  borderColor: "#1976d2",
  boxShadow: "0 4px 12px rgba(25, 118, 210, 0.15)"
};

const adminButtonStyle = {
  ...roleButtonBase,
  borderColor: "#d32f2f",
  boxShadow: "0 4px 12px rgba(211, 47, 47, 0.15)"
};

const backButtonStyle = {
  background: "none",
  border: "none",
  color: "#1976d2",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  padding: "0",
  transition: "color 0.3s ease"
};

const formGroupStyle = {
  marginBottom: "20px"
};

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: "700",
  color: "#333",
  marginBottom: "8px",
  textTransform: "uppercase",
  letterSpacing: "0.5px"
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "6px",
  border: "1.5px solid #e0e0e0",
  fontSize: "14px",
  boxSizing: "border-box",
  transition: "all 0.3s ease",
  fontFamily: "inherit",
  outline: "none"
};

const submitButtonStyle = {
  width: "100%",
  padding: "13px 16px",
  backgroundColor: "#d32f2f",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "700",
  marginTop: "10px",
  transition: "all 0.3s ease",
  boxShadow: "0 2px 8px rgba(211, 47, 47, 0.3)"
};
const errorBoxStyle = {
  backgroundColor: "#ffebee",
  color: "#c62828",
  padding: "12px 14px",
  borderRadius: "6px",
  marginBottom: "20px",
  fontSize: "13px",
  border: "1px solid #ef5350",
  display: "flex",
  alignItems: "center"
};

export default Login;
