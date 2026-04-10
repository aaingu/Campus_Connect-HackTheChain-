import { useState } from "react";

export default function Login({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Member");

  // 🔹 LOGIN
  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("members")) || [];

    const foundUser = users.find(
      (u) => u.name === username && u.password === password
    );

    if (foundUser) {
      localStorage.setItem("user", foundUser.name);
      localStorage.setItem("role", foundUser.role);
      setUser(foundUser.name);
    } else {
      alert("Invalid credentials");
    }
  };

  // 🔹 SIGNUP
  const handleSignup = () => {
    if (!username || !password) return;

    const users = JSON.parse(localStorage.getItem("members")) || [];

    // check duplicate
    if (users.find((u) => u.name === username)) {
      alert("User already exists");
      return;
    }

    const newUser = {
      id: users.length + 1,
      name: username,
      role: role,
      password: password,
    };

    localStorage.setItem("members", JSON.stringify([...users, newUser]));

    alert("Account created! Now login.");
    setIsLogin(true);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg space-y-4 w-80">

        <h2 className="text-xl font-semibold">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 rounded bg-gray-700"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 rounded bg-gray-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {!isLogin && (
          <select
            className="w-full p-2 rounded bg-gray-700"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option>Member</option>
            <option>Admin</option>
          </select>
        )}

        <button
          onClick={isLogin ? handleLogin : handleSignup}
          className="w-full bg-blue-600 py-2 rounded"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>

        <p
          className="text-sm text-gray-400 cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </p>

      </div>
    </div>
  );
}