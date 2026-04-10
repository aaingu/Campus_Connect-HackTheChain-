export default function Resources() {
  const resources = [
    { id: 1, title: "React Guide" },
    { id: 2, title: "Tailwind Docs" },
    { id: 3, title: "Node.js Handbook" },
  ];

  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-semibold">Resources</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((r) => (
          <div
            key={r.id}
            className="bg-gray-800 p-5 rounded-xl shadow hover:scale-105 transition"
          >
            <h3 className="text-lg font-bold">{r.title}</h3>
          </div>
        ))}
      </div>

    </div>
  );
}