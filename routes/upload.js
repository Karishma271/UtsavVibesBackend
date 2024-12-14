const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const router = express.Router();
const Venue = require('../models/Venue'); // Assuming Venue model is in the 'models' folder

// Setup multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); // Store the image in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage: storage });

// Upload route for handling images
router.post('/upload-image', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Construct the image URL (if you're storing images locally)
  const imageUrl = `/uploads/${req.file.filename}`;

  try {
    // Create a new venue or update an existing venue with the image URL
    const newVenue = new Venue({
      occasionType: req.body.occasionType,
      venueName: req.body.venueName,
      description: req.body.description,
      address: req.body.address,
      capacity: req.body.capacity,
      acceptedPayments: req.body.acceptedPayments,
      imageUrl, // Save the image URL in the database
    });

    // Save the venue to MongoDB
    await newVenue.save();

    res.status(200).json({ message: 'Venue added successfully', venue: newVenue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving venue', error });
  }
});

module.exports = router;
