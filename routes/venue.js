const express = require('express');
const router = express.Router();
const Venue = require('../models/Venue');

// Route to get all venues
router.get('/', async (req, res) => {
  try {
    const venues = await Venue.find();
    res.status(200).json(venues);
  } catch (err) {
    res.status(400).send('Error fetching venues');
  }
});

// Route to get a single venue by ID
router.get('/:id', async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).send('Venue not found');
    }
    res.json(venue);
  } catch (err) {
    res.status(400).send('Error fetching venue');
  }
});

// Route to create a new venue
router.post('/', async (req, res) => {
  try {
    const { occasionType, venueName, description, address, capacity, acceptedPayments, imageUrl } = req.body;
    const newVenue = new Venue({
      occasionType,
      venueName,
      description,
      address,
      capacity,
      acceptedPayments,
      imageUrl,
    });
    await newVenue.save();
    res.status(201).json(newVenue);
  } catch (err) {
    console.error('Error creating venue:', err);
    res.status(400).send('Error creating venue');
  }
});

// Route to update an existing venue
router.put('/:id', async (req, res) => {
  try {
    const updatedVenue = await Venue.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedVenue) {
      return res.status(404).send('Venue not found');
    }
    res.json(updatedVenue);
  } catch (err) {
    console.error('Error updating venue:', err);
    res.status(400).send('Error updating venue');
  }
});

// Route to delete a venue
router.delete('/:id', async (req, res) => {
  try {
    const venue = await Venue.findByIdAndDelete(req.params.id);
    if (!venue) {
      return res.status(404).send('Venue not found');
    }
    res.status(200).send('Venue deleted successfully');
  } catch (err) {
    console.error('Error deleting venue:', err);
    res.status(400).send('Error deleting venue');
  }
});

module.exports = router;
