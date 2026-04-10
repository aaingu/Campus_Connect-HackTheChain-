const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

let events = [
  {
    id: 1,
    title: "HackTheChain 4.0",
    seats: 50,
    registered: 0
  },
  {
    id: 2,
    title: "AI Workshop",
    seats: 30,
    registered: 0
  }
];

app.get("/events", (req, res) => {
  res.json({
    success: true,
    data: events
  });
});

app.post("/events", (req, res) => {
  const { title, seats } = req.body;

  if (!title || !seats) {
    return res.status(400).json({
      success: false,
      message: "Title and seats are required"
    });
  }

  const event = {
    id: events.length + 1,
    title,
    seats,
    registered: 0
  };

  events.push(event);

  res.json({
    success: true,
    message: "Event created successfully",
    data: event
  });
});

app.listen(PORT, () => {
  console.log(`Event service running on port ${PORT}`);
});