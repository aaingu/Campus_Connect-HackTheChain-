require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose"); // 1. Added Mongoose

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

app.use(cors());
app.use(express.json());

// 2. Connect to MongoDB Cloud (from your .env file)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Auth Service: Successfully connected to MongoDB Cloud"))
  .catch((err) => console.error("❌ Auth Service: Database connection error:", err));

// 3. Create a User Model (Replaces 'let users = []')
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "student" }
});

const User = mongoose.model("User", UserSchema);

// --- SIGNUP ---
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    // Check if user exists in the DATABASE
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    
    await newUser.save(); // Save to MongoDB

    res.status(201).json({
      success: true,
      message: "User created in MongoDB",
      user: { id: newUser._id, name: newUser.name, email: newUser.email }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error during signup" });
  }
});

// --- LOGIN ---
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user in the DATABASE
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { name: user.name, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error during login" });
  }
});

app.listen(PORT, () => {
  console.log(`Auth service running on http://localhost:${PORT}`);
});