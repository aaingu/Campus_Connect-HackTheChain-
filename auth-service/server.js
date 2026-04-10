const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let users = [];

app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required"
    });
  }

  const existingUser = users.find((u) => u.email === email);

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User already exists"
    });
  }

  const user = {
    id: users.length + 1,
    name,
    email,
    password,
    role: "student"
  };

  users.push(user);

  res.json({
    success: true,
    message: "Signup successful",
    user
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials"
    });
  }

  res.json({
    success: true,
    message: "Login successful",
    token: "demo-token",
    role: user.role
  });
});

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});