import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function MainLayout({ children, setUser }) {
  const user = localStorage.getItem("user");

  const [notifications, setNotifications] = useState([
    "Welcome to Campus Connect 🎉",
  ]);

  const baseStyle = "px-4 py-2 rounded transition";
  const activeStyle = "bg-gray-700";

  return (
    <div className="min-h-screen bg-gray-900 text-white">

      {/* Top Bar */}
      <div className="flex justify-between items-center px-8 pt-6">
        <h1 className="text-2xl font-semibold">
          Welcome, {user} 👋
        </h1>

        {/* Logout Button */}
        <button
          onClick={() => {
            localStorage.removeItem("user");
            setUser(null); // 🔥 FIXED logout
          }}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-500 transition"
        >
          Logout
        </button>
      </div>

      {/* Title */}
      <div className="px-8 mt-4">
        <h2 className="text-3xl font-bold tracking-wide">
          Campus Connect
        </h2>
      </div>

      {/* Notifications */}
      <div className="px-8 mt-4 space-y-2">
        {notifications.map((n, i) => (
          <div
            key={i}
            className="bg-blue-600 px-4 py-2 rounded shadow"
          >
            {n}
          </div>
        ))}
      </div>

      {/* Navbar */}
      <div className="mt-6 border-t border-gray-700 px-8 py-4 flex gap-12 text-lg">

        <NavLink
          to="/"
          className={({ isActive }) =>
            `${baseStyle} ${isActive ? activeStyle : "hover:bg-gray-700"}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/members"
          className={({ isActive }) =>
            `${baseStyle} ${isActive ? activeStyle : "hover:bg-gray-700"}`
          }
        >
          Members
        </NavLink>

        <NavLink
          to="/resources"
          className={({ isActive }) =>
            `${baseStyle} ${isActive ? activeStyle : "hover:bg-gray-700"}`
          }
        >
          Resources
        </NavLink>

        <NavLink
          to="/activity"
          className={({ isActive }) =>
            `${baseStyle} ${isActive ? activeStyle : "hover:bg-gray-700"}`
          }
        >
          Activity
        </NavLink>

      </div>

      {/* Page Content */}
      <div className="px-8 py-6">
        {children}
      </div>

    </div>
  );
}