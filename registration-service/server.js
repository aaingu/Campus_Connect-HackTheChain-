const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3003;

app.use(cors());
app.use(express.json());

let registrations = [];
let waitlist = [];
const MAX_SEATS = 2;

app.post("/register", (req, res) => {
  const { name, eventId } = req.body;

  if (!name || !eventId) {
    return res.status(400).json({
      success: false,
      message: "Name and eventId are required"
    });
  }

  if (registrations.length < MAX_SEATS) {
    const registration = {
      id: registrations.length + 1,
      name,
      eventId,
      status: "confirmed"
    };

    registrations.push(registration);

    return res.json({
      success: true,
      status: "confirmed",
      message: "Registration successful",
      data: registration
    });
  }

  const waitingUser = {
    id: waitlist.length + 1,
    name,
    eventId,
    status: "waitlisted"
  };

  waitlist.push(waitingUser);

  res.json({
    success: true,
    status: "waitlisted",
    message: "Added to waitlist",
    data: waitingUser
  });
});

app.get("/registrations", (req, res) => {
  res.json({
    success: true,
    data: registrations
  });
});

app.get("/waitlist", (req, res) => {
  res.json({
    success: true,
    data: waitlist
  });
});

app.listen(PORT, () => {
  console.log(`Registration service running on port ${PORT}`);
});