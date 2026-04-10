export default function Activity() {
  const logs = [
    "Alice joined",
    "Bob uploaded resource",
    "New event created",
  ];

  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-semibold">Activity</h2>

      <div className="bg-gray-800 p-4 rounded-lg space-y-2">
        {logs.map((log, index) => (
          <p key={index} className="text-gray-300">
            • {log}
          </p>
        ))}
      </div>

    </div>
  );
}