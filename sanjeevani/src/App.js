import User from "./User";
import Admin from "./Admin";
import { useState } from "react";

function App() {
  const [page, setPage] = useState("user");

  return (
    <div>
      <button onClick={() => setPage("user")}>User View</button>
      <button onClick={() => setPage("admin")}>Admin View</button>
      {page === "user" ? <User /> : <Admin />}
    </div>
  );
}

export default App;