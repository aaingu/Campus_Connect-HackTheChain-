require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// 1. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Registration Service: Connected to MongoDB Cloud"))
  .catch((err) => console.error("❌ Registration Service: DB Error:", err));

// 2. Define Schemas (Registration service needs both to talk to the shared DB)
const RegSchema = new mongoose.Schema({
  name: { type: String, required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  status: { type: String, enum: ["confirmed", "waitlisted"], required: true },
  createdAt: { type: Date, default: Date.now }
});

const EventSchema = new mongoose.Schema({
  title: String,
  seats: Number,
  registered: { type: Number, default: 0 }
});

const Registration = mongoose.model("Registration", RegSchema);
const Event = mongoose.model("Event", EventSchema);

// 3. The Waitlist Algorithm (FIFO)
app.post("/register", async (req, res) => {
  try {
    const { name, eventId, maxSeats } = req.body;

    // A. Count existing CONFIRMED registrations for this event
    const confirmedCount = await Registration.countDocuments({ eventId, status: "confirmed" });

    // B. Determine Status
    let status = "confirmed";
    if (confirmedCount >= maxSeats) {
      status = "waitlisted";
    }

    // C. Save the Registration
    const newReg = new Registration({ name, eventId, status });
    await newReg.save();

    // 🌟 GOLDEN FEATURE: Atomic Increment
    // If the student got a confirmed seat, we update the Event's "registered" counter
    if (status === "confirmed") {
      await Event.findByIdAndUpdate(eventId, { $inc: { registered: 1 } });
    }

    res.status(201).json({
      success: true,
      status: status,
      message: status === "confirmed" ? "Registration Successful!" : "Event Full. Added to Waitlist.",
      data: newReg
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Registration service running on http://localhost:${PORT}`);
});