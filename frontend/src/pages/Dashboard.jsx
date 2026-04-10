import { useState } from "react";

export default function Dashboard() {
  const [stats] = useState({
    members: 120,
    resources: 45,
    events: 8,
    activity: 230,
  });

  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-semibold">Dashboard Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <Card title="Members" value={stats.members} />
        <Card title="Resources" value={stats.resources} />
        <Card title="Events" value={stats.events} />
        <Card title="Activity" value={stats.activity} />

      </div>

    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-gray-800 p-5 rounded-xl shadow hover:scale-105 transition">
      <h3 className="text-gray-400 text-sm">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}