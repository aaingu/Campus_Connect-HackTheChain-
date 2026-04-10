import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Resources from "./pages/Resources";
import Activity from "./pages/Activity";
import Login from "./pages/Login";

function App() {
  const [user, setUser] = useState(localStorage.getItem("user"));
  const role = localStorage.getItem("role");

  if (!user) {
    return <Login setUser={setUser} />;
  }

  return (
    <MainLayout setUser={setUser}>
      <Routes>

        <Route path="/" element={<Dashboard />} />

        {/* Admin only */}
        {role === "Admin" && (
          <>
            <Route path="/members" element={<Members />} />
            <Route path="/activity" element={<Activity />} />
          </>
        )}

        {/* Shared */}
        <Route path="/resources" element={<Resources />} />

      </Routes>
    </MainLayout>
  );
}

export default App;