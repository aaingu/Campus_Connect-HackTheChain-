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

  if (!user) {
    return <Login setUser={setUser} />;
  }

  return (
    <MainLayout setUser={setUser}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/members" element={<Members />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/activity" element={<Activity />} />
      </Routes>
    </MainLayout>
  );
}

export default App;