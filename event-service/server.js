require('dotenv').config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// IMPROVEMENT: Seed data with more descriptive fields
let events = [
  {
    id: 1712781234567, 
    title: "HackTheChain 4.0",
    description: "The ultimate campus hackathon experience.",
    seats: 50,
    registered: 0
  },
  {
    id: 1712781234568,
    title: "AI Workshop",
    description: "Deep dive into LLMs and Generative AI.",
    seats: 30,
    registered: 0
  }
];

// --- GET ALL EVENTS ---
app.get("/events", (req, res) => {
  res.json({ success: true, data: events });
});

// --- CREATE EVENT ---
app.post("/events", (req, res) => {
  const { title, seats, description } = req.body;

  if (!title || !seats) {
    return res.status(400).json({ success: false, message: "Title and seats are required" });
  }

  const newEvent = {
    id: Date.now(), // Unique ID based on timestamp
    title,
    description: description || "",
    seats: parseInt(seats),
    registered: 0
  };

  events.push(newEvent);
  res.status(201).json({ success: true, message: "Event created", data: newEvent });
});

// --- IMPROVISATION: REGISTER FOR EVENT ---
app.patch("/events/:id/register", (req, res) => {
  const eventId = parseInt(req.params.id);
  const event = events.find(e => e.id === eventId);

  if (!event) {
    return res.status(404).json({ success: false, message: "Event not found" });
  }

  if (event.registered >= event.seats) {
    return res.status(400).json({ success: false, message: "Event is full!" });
  }

  event.registered += 1;

  res.json({ 
    success: true, 
    message: `Successfully registered for ${event.title}`, 
    remainingSeats: event.seats - event.registered 
  });
});

// --- IMPROVISATION: DELETE EVENT ---
app.delete("/events/:id", (req, res) => {
  const eventId = parseInt(req.params.id);
  const initialLength = events.length;
  events = events.filter(e => e.id !== eventId);

  if (events.length === initialLength) {
    return res.status(404).json({ success: false, message: "Event not found" });
  }

  res.json({ success: true, message: "Event deleted" });
});

app.listen(PORT, () => {
  console.log(`Event service running on http://localhost:${PORT}`);
});