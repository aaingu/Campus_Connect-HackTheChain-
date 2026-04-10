require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// 1. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Event Service: Connected to MongoDB Cloud"))
  .catch((err) => console.error("❌ Event Service: DB Error:", err));

// 2. Event Schema
const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  seats: { type: Number, required: true },
  registered: { type: Number, default: 0 } // Total confirmed registrations
});

const Event = mongoose.model("Event", EventSchema);

// 3. Routes
// Fetch all events
app.get("/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching events" });
  }
});

// Create an event (Use this once via Postman or simple script to seed data)
app.post("/events", async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json({ success: true, data: newEvent });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error creating event" });
  }
});

app.listen(PORT, () => {
  console.log(`Event service running on http://localhost:${PORT}`);
});