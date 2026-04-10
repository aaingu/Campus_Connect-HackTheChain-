require('dotenv').config();
const mongoose = require('mongoose');

// Define the schema so the script knows what an Event looks like
const EventSchema = new mongoose.Schema({
    title: String,
    description: String,
    seats: Number,
    registered: { type: Number, default: 0 }
});

const Event = mongoose.model('Event', EventSchema);

const seedEvents = [
    {
        title: "HackTheChain 4.0",
        description: "The ultimate 24-hour hackathon. 🚀",
        seats: 50,
        registered: 45 // Almost full
    },
    {
        title: "Deep Learning Workshop",
        description: "Intro to Neural Networks. Very limited seating!",
        seats: 2,
        registered: 0 // Fresh and ready to test waitlist
    },
    {
        title: "UI/UX Design Sprint",
        description: "Learn Figma and prototyping basics.",
        seats: 15,
        registered: 5 // Plenty of vacancy
    },
    {
        title: "Placement Talk: Google",
        description: "How to crack the technical interview.",
        seats: 100,
        registered: 98 // High pressure, show close to capacity
    }
];

const runSeeder = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        // Optional: Clear existing events so you don't have duplicates
        await Event.deleteMany({});
        console.log("Cleared old events.");

        await Event.insertMany(seedEvents);
        console.log("✅ Database Seeded Successfully!");

        process.exit();
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
};

runSeeder();