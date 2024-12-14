// Required Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
require("dotenv").config(); 

// Create Express app
const app = express();

// Import Routes
const uploadRouter = require('./routes/upload'); 
const authRoutes = require("./routes/auth");
const venueRoutes = require("./routes/venue");

// Event Models
const weddingEvents = mongoose.model("weddingEvents", {
  brideName: String,
  groomName: String,
  eventDate: Date,
  venue: String,
  email: String,
  phoneNumber: String,
});

const birthdayEvents = mongoose.model("birthdayEvents", {
  personName: String,
  eventDate: Date,
  venue: String,
  email: String,
  phoneNumber: String,
});

const corporateEvents = mongoose.model("corporateEvents", {
  companyName: String,
  eventDate: Date,
  venue: String,
  email: String,
  phoneNumber: String,
});

const Organizer = mongoose.model("Organizer", {
  name: String,
  description: String,
  category: String,
  address: String,
  email: String,
  contactNumber: String,
  website: String,
});

// CORS Setup
const corsOptions = {
  origin: 'https://www.utsavvibes.tech', // Allow requests from this domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
  credentials: true, // Allow credentials such as cookies
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json()); // Middleware to parse JSON requests
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded requests

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Serve static files (like uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import and use routes
app.use("/api", authRoutes);  // Authentication routes
app.use("/api", uploadRouter); // Image upload routes
app.use("/api/venues", venueRoutes); // Venue routes

// Welcome message route
app.get("/", (req, res) => {
  res.send("Hello, welcome to the UtsavVibes backend!");
});
// Serve static files (images) from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Venue Routes
app.get("/api/venues", async (req, res) => {
  try {
    const venues = await Venue.find();
    res.status(200).json(venues);
  } catch (error) {
    console.error("Error fetching venues:", error);
    res.status(500).json({ message: "Error fetching venues", error: error.message });
  }
});

app.post("/api/venues", async (req, res) => {
  try {
    const newVenue = new Venue(req.body);
    await newVenue.save();
    res.status(201).json(newVenue);
  } catch (error) {
    console.error("Error creating venue:", error);
    res.status(400).json({ error: error.message });
  }
});

app.put("/api/venues/:id", async (req, res) => {
  try {
    const updatedVenue = await Venue.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedVenue);
  } catch (error) {
    console.error("Error updating venue:", error);
    res.status(500).json({ message: "Error updating venue", error: error.message });
  }
});

app.delete("/api/venues/:id", async (req, res) => {
  try {
    await Venue.findByIdAndRemove(req.params.id);
    res.status(200).json({ message: "Venue removed successfully" });
  } catch (error) {
    console.error("Error removing venue:", error);
    res.status(500).json({ message: "Error removing venue", error: error.message });
  }
});

// Event Registration Routes
app.post("/wedding", async (req, res) => {
  try {
    const event = new weddingEvents(req.body);
    await event.save();
    res.json({ message: "Wedding Event registered successfully" });
  } catch (error) {
    console.error("Error registering wedding event:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

app.post("/birthday", async (req, res) => {
  try {
    const event = new birthdayEvents(req.body);
    await event.save();
    res.json({ message: "Birthday Event registered successfully" });
  } catch (error) {
    console.error("Error registering birthday event:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

app.post("/corporate", async (req, res) => {
  try {
    const event = new corporateEvents(req.body);
    await event.save();
    res.json({ message: "Corporate Event registered successfully" });
  } catch (error) {
    console.error("Error registering corporate event:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// Organizer Routes
app.get("/api/organizers", async (req, res) => {
  try {
    const organizers = await Organizer.find();
    res.status(200).json(organizers);
  } catch (error) {
    console.error("Error fetching organizers:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

app.post("/api/organizers", async (req, res) => {
  try {
    const newOrganizer = new Organizer(req.body);
    await newOrganizer.save();
    res.status(201).json(newOrganizer);
  } catch (error) {
    console.error("Error saving organizer:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

app.put("/api/organizers/:id", async (req, res) => {
  try {
    const updatedOrganizer = await Organizer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedOrganizer);
  } catch (error) {
    console.error("Error updating organizer:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

app.delete("/api/organizers/:id", async (req, res) => {
  try {
    await Organizer.findByIdAndRemove(req.params.id);
    res.status(200).json({ message: "Organizer removed successfully" });
  } catch (error) {
    console.error("Error removing organizer:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// Count Routes
app.get("/api/users/count", async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.status(200).json({ count: userCount });
  } catch (error) {
    console.error("Error counting users:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

app.get("/api/venue/count", async (req, res) => {
  try {
    const count = await Venue.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error counting venues:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

app.get("/api/organizer/count", async (req, res) => {
  try {
    const count = await Organizer.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// Start Server
const PORT = process.env.PORT || 4500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
