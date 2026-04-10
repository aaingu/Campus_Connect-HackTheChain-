import { NavLink } from "react-router-dom";

export default function MainLayout({ children }) {
  const baseStyle = "px-4 py-2 rounded transition";
  const activeStyle = "bg-gray-700";

  return (
    <div className="min-h-screen bg-gray-900 text-white">

      {/* Welcome */}
      <div className="px-8 pt-6">
        <h1 className="text-2xl font-semibold">
          Welcome, Kelp 👋
        </h1>
      </div>

      {/* Title */}
      <div className="px-8 mt-4">
        <h2 className="text-3xl font-bold">
          Campus Connect
        </h2>
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