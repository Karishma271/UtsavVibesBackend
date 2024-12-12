const express = require('express');
const router = express.Router();
const Organizer = require('../models/Organizer');  
const authMiddleware = require('../middleware/auth');  

// Get all organizers
router.get('/', async (req, res) => {
  try {
    const organizers = await Organizer.find();
    res.json(organizers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching organizers' });
  }
});

// Get a single organizer by ID
router.get('/:id', async (req, res) => {
  try {
    const organizer = await Organizer.findById(req.params.id);
    if (!organizer) {
      return res.status(404).json({ message: 'Organizer not found' });
    }
    res.json(organizer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching organizer' });
  }
});

// Create a new organizer
router.post('/', async (req, res) => {
  const { name, description, category, address, email, contactNumber } = req.body;
  
  try {
    const newOrganizer = new Organizer({
      name,
      description,
      category,
      address,
      email,
      contactNumber,
    });

    await newOrganizer.save();
    res.status(201).json(newOrganizer);
  } catch (error) {
    res.status(500).json({ message: 'Error creating organizer' });
  }
});

// Update an existing organizer
router.put('/:id', async (req, res) => {
  const { name, description, category, address, email, contactNumber } = req.body;

  try {
    const updatedOrganizer = await Organizer.findByIdAndUpdate(
      req.params.id,
      { name, description, category, address, email, contactNumber },
      { new: true }  // Returns the updated organizer
    );

    if (!updatedOrganizer) {
      return res.status(404).json({ message: 'Organizer not found' });
    }

    res.json(updatedOrganizer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating organizer' });
  }
});

// Delete an organizer
router.delete('/:id', async (req, res) => {
  try {
    const deletedOrganizer = await Organizer.findByIdAndDelete(req.params.id);
    if (!deletedOrganizer) {
      return res.status(404).json({ message: 'Organizer not found' });
    }
    res.json({ message: 'Organizer deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting organizer' });
  }
});

module.exports = router;
