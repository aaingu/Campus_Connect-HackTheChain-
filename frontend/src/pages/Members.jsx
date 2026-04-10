import { useState, useEffect } from "react";

export default function Members() {
  const [members, setMembers] = useState([]);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");

  const [editingId, setEditingId] = useState(null);

  // 🔹 Load from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("members")) || [];
    setMembers(stored);
  }, []);

  // 🔹 Add Member
  const addMember = () => {
    if (!name || !role) return;

    const newMember = {
      id: members.length + 1,
      name,
      role,
    };

    const updated = [...members, newMember];
    setMembers(updated);
    localStorage.setItem("members", JSON.stringify(updated));

    setName("");
    setRole("");
  };

  // 🔹 Delete Member
  const deleteMember = (id) => {
    const updated = members.filter((m) => m.id !== id);
    setMembers(updated);
    localStorage.setItem("members", JSON.stringify(updated));
  };

  // 🔹 Start Edit
  const startEdit = (member) => {
    setEditingId(member.id);
    setName(member.name);
    setRole(member.role);
  };

  // 🔹 Save Edit
  const saveEdit = () => {
    const updated = members.map((m) =>
      m.id === editingId ? { ...m, name, role } : m
    );

    setMembers(updated);
    localStorage.setItem("members", JSON.stringify(updated));

    setEditingId(null);
    setName("");
    setRole("");
  };

  // 🔹 Filter logic
  const filteredMembers = members.filter((m) => {
    const matchesSearch = m.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesRole =
      filterRole === "All" || m.role === filterRole;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">

      {/* Title */}
      <h2 className="text-2xl font-semibold">Members</h2>

      {/* Controls */}
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

        {editingId ? (
          <button
            onClick={saveEdit}
            className="bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-500 transition"
          >
            Save
          </button>
        ) : (
          <button
            onClick={addMember}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition"
          >
            Add
          </button>
        )}

        {/* Search */}
        <input
          type="text"
          placeholder="Search..."
          className="p-2 rounded bg-gray-700 text-white outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filter */}
        <select
          className="p-2 rounded bg-gray-700 text-white"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option>All</option>
          <option>Admin</option>
          <option>Member</option>
        </select>

      </div>

      {/* Table */}
      <div className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <table className="w-full text-left">

          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="py-2">ID</th>
              <th>Name</th>
              <th>Role</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredMembers.map((m) => (
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

                {/* Actions */}
                <td className="text-right space-x-2">

                  <button
                    onClick={() => startEdit(m)}
                    className="bg-yellow-600 px-3 py-1 rounded hover:bg-yellow-500 transition"
                  >
                    Edit
                  </button>

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