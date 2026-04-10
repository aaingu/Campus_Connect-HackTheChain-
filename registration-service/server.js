const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// IMPROVEMENT: Using objects to track events specifically
// In a real app, this would be a MongoDB collection
let registrations = []; // { id, name, eventId, status }
let waitlist = [];      // { id, name, eventId, status }

// This represents data that would normally come from your Event Service
const EVENT_CAPACITY = {
  "1": 2, // Event ID 1 has 2 seats
  "2": 10 // Event ID 2 has 10 seats
};

// --- REGISTER ---
app.post("/register", (req, res) => {
  const { name, eventId } = req.body;

  if (!name || !eventId) {
    return res.status(400).json({ success: false, message: "Name and eventId required" });
  }

  // Check if event exists and get its capacity
  const capacity = EVENT_CAPACITY[eventId] || 5; // Default to 5 if not specified

  // Count current confirmed registrations for THIS specific event
  const currentCount = registrations.filter(r => r.eventId === eventId).length;

  if (currentCount < capacity) {
    const registration = {
      id: Date.now(),
      name,
      eventId,
      status: "confirmed"
    };
    registrations.push(registration);
    return res.json({ success: true, status: "confirmed", data: registration });
  }

  // If full, add to waitlist
  const waitingUser = {
    id: Date.now(),
    name,
    eventId,
    status: "waitlisted"
  };
  waitlist.push(waitingUser);
  res.json({ success: true, status: "waitlisted", message: "Event full. Added to waitlist.", data: waitingUser });
});

// --- IMPROVISATION: CANCEL & AUTO-PROMOTE ---
app.post("/cancel", (req, res) => {
  const { registrationId, eventId } = req.body;

  // 1. Remove the user from confirmed registrations
  const initialCount = registrations.length;
  registrations = registrations.filter(r => r.id !== registrationId);

  if (registrations.length < initialCount) {
    // 2. LOGIC: Check if anyone is waiting for THIS specific event
    const nextInLineIndex = waitlist.findIndex(w => w.eventId === eventId);

    if (nextInLineIndex !== -1) {
      // 3. Promote the first person in the waitlist
      const promotedUser = waitlist.splice(nextInLineIndex, 1)[0];
      promotedUser.status = "confirmed";
      registrations.push(promotedUser);

      console.log(`Auto-promoted ${promotedUser.name} to event ${eventId}`);
    }

    return res.json({ success: true, message: "Registration cancelled and waitlist updated." });
  }

  res.status(404).json({ success: false, message: "Registration not found." });
});

// --- VIEWING DATA ---
app.get("/registrations/:eventId", (req, res) => {
  const eventId = req.params.eventId;
  const confirmed = registrations.filter(r => r.eventId === eventId);
  const waiting = waitlist.filter(w => w.eventId === eventId);

  res.json({ success: true, eventId, confirmed, waitlist: waiting });
});

app.listen(PORT, () => {
  console.log(`Registration service running on port ${PORT}`);
});