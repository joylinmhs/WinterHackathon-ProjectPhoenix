import User from "./User";
import Admin from "./Admin";
import { useState } from "react";

function App() {
  const [page, setPage] = useState("user");

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center", color: "#2c3e50" }}>
        🏥 Sanjeevani – Smart Emergency Hospital Finder
      </h1>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={() => setPage("user")}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: page === "user" ? "#27ae60" : "#bdc3c7",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          User View
        </button>

        <button
          onClick={() => setPage("admin")}
          style={{
            padding: "10px 20px",
            backgroundColor: page === "admin" ? "#2980b9" : "#bdc3c7",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Admin View
        </button>
      </div>

      <hr />

      {page === "user" ? <User /> : <Admin />}
    </div>
  );
}

export default App;
