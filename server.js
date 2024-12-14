// Required Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require ("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
require("dotenv").config(); // Load environment variables

// Models
const User = require("./models/User");
const Venue = require("./models/Venue");
const hallsRoute = require('./routes/halls');
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

// Create Express app
const app = express();

// CORS Setup
const corsOptions = {
  origin: 'https://www.utsavvibes.tech', // Allow requests from this domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
  credentials: true, // Allow credentials such as cookies
};


// Use CORS middleware with the options
app.use(cors(corsOptions));

// Enable CORS middleware
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
// Serve static files (images, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Serve images

// File upload setup
const upload = multer({ dest: "uploads" });

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Welcome message route
app.get("/", (req, res) => {
  res.send("Hello, welcome to the UtsavVibes backend!");
});

// Import and use routes
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

// Venue Routes
const venueRoutes = require("./routes/venue");
app.use("/api/venues", venueRoutes);

// Fetch venues
app.get("/api/venues", async (req, res) => {
  try {
    const venues = await Venue.find();
    res.status(200).json(venues);
  } catch (error) {
    console.error("Error fetching venues:", error);
    res.status(500).json({ message: "Error fetching venues", error: error.message });
  }
});

app.use('/api/halls', hallsRoute);
// POST a new venue
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

// PUT update venue
app.put("/api/venues/:id", async (req, res) => {
  try {
    const updatedVenue = await Venue.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedVenue);
  } catch (error) {
    console.error("Error updating venue:", error);
    res.status(500).json({ message: "Error updating venue", error: error.message });
  }
});

// DELETE venue
app.delete("/api/venues/:id", async (req, res) => {
  try {
    await Venue.findByIdAndRemove(req.params.id);
    res.status(200).json({ message: "Venue removed successfully" });
  } catch (error) {
    console.error("Error removing venue:", error);
    res.status(500).json({ message: "Error removing venue", error: error.message });
  }
});

// File upload route for images
app.post("/api/upload-image", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageUrl = `/uploads/${req.file.filename}`; // Construct the URL
    res.status(200).json({ imageUrl }); // Return the image URL to the frontend
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.status(200).json(users); // Return the users as JSON
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users", error: error.message });
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

// Backend route for organizer count
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
