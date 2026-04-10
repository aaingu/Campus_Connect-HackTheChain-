import { useState } from "react";

export default function Login({ setUser }) {
  const [username, setUsername] = useState("");

  const handleLogin = () => {
    if (!username) return;

    localStorage.setItem("user", username);
    setUser(username); // 🔥 triggers re-render
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg space-y-4 w-80">

        <h2 className="text-xl font-semibold">Login</h2>

        <input
          type="text"
          placeholder="Enter username"
          className="w-full p-2 rounded bg-gray-700"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 py-2 rounded hover:bg-blue-500"
        >
          Login
        </button>

      </div>
    </div>
  );
}