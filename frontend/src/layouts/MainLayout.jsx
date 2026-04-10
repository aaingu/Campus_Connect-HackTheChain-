export default function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 p-5">
        <h2 className="text-xl font-bold mb-6">Modular Commons</h2>
        <ul className="space-y-4">
          <li>Dashboard</li>
          <li>Members</li>
          <li>Resources</li>
          <li>Activity</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        
        {/* Navbar */}
        <div className="h-16 bg-gray-800 flex items-center px-6">
          <h1 className="text-lg">Dashboard</h1>
        </div>

        {/* Page Content */}
        <div className="p-6">
          <h2>Welcome 👋</h2>
        </div>

      </div>
    </div>
  );
}