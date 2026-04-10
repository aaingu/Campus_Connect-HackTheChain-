import { useState } from "react";

export default function Members() {
  const [members, setMembers] = useState([
    { id: 1, name: "Alice", role: "Admin" },
    { id: 2, name: "Bob", role: "Member" },
  ]);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const addMember = () => {
    if (!name || !role) return;

    const newMember = {
      id: members.length + 1,
      name,
      role,
    };

    setMembers([...members, newMember]);
    setName("");
    setRole("");
  };

  const deleteMember = (id) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-6">

      {/* Title */}
      <h2 className="text-2xl font-semibold">Members</h2>

      {/* Add Member */}
      <div className="bg-gray-800 p-4 rounded-lg flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Name"
          className="p-2 rounded bg-gray-700 text-white outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Role"
          className="p-2 rounded bg-gray-700 text-white outline-none"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <button
          onClick={addMember}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition"
        >
          Add
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <table className="w-full text-left">

          {/* Header */}
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="py-2">ID</th>
              <th>Name</th>
              <th>Role</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {members.map((m) => (
              <tr
                key={m.id}
                className="border-b border-gray-700 hover:bg-gray-700/40"
              >
                <td className="py-2">{m.id}</td>
                <td>{m.name}</td>

                {/* Role Badge */}
                <td>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      m.role === "Admin"
                        ? "bg-purple-600"
                        : "bg-green-600"
                    }`}
                  >
                    {m.role}
                  </span>
                </td>

                {/* Delete Button */}
                <td className="text-right">
                  <button
                    onClick={() => deleteMember(m.id)}
                    className="bg-red-600 px-3 py-1 rounded hover:bg-red-500 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}