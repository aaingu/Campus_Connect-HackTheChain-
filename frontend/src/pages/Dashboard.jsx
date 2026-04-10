import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {

  const stats = [
    { title: "Members", value: 120 },
    { title: "Resources", value: 45 },
    { title: "Events", value: 8 },
    { title: "Activity", value: 230 },
  ];

  const chartData = [
    { name: "Members", value: 120 },
    { name: "Resources", value: 45 },
    { name: "Events", value: 8 },
  ];

  const recentActivity = [
    "Alice joined the platform",
    "Bob uploaded a resource",
    "New event created",
    "Charlie updated profile",
  ];

  return (
    <div className="space-y-8">

      {/* Title */}
      <h2 className="text-2xl font-semibold">Dashboard Overview</h2>

      {/* 🔥 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, index) => (
          <div
            key={index}
            className="bg-gray-800 p-5 rounded-xl shadow hover:scale-105 transition"
          >
            <h3 className="text-gray-400 text-sm">{s.title}</h3>
            <p className="text-2xl font-bold mt-2">{s.value}</p>
          </div>
        ))}
      </div>

      {/* 📊 Chart + Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Chart */}
        <div className="bg-gray-800 p-6 rounded-xl col-span-2">
          <h3 className="mb-4 text-lg font-semibold">Overview</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Activity */}
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="mb-4 text-lg font-semibold">Recent Activity</h3>

          <div className="space-y-3">
            {recentActivity.map((item, index) => (
              <div
                key={index}
                className="bg-gray-700 px-3 py-2 rounded"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}