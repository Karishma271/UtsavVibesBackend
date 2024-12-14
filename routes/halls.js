const express = require('express');
const Venue = require('../models/Venue'); // Import the Venue model
const router = express.Router();

// Get a specific venue by its ID
router.get('/find/:id', async (req, res) => {
  try {
    const venueId = req.params.id;  // Get the venue ID from the URL parameter

    // Find the venue by its ID in the database
    const venue = await Venue.findById(venueId);

    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    res.status(200).json(venue);  // Return the venue data as a response
  } catch (error) {
    console.error('Error fetching venue:', error);
    res.status(500).json({ message: 'Error fetching venue details', error });
  }
});

module.exports = router;
