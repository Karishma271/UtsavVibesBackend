const express = require('express');
const router = express.Router();
const Venue = require('../models/Venue');


/**
 * Route to get all venues
 */
router.get('/', async (req, res) => {
  try {
    const venues = await Venue.find();
    res.status(200).json(venues);
  } catch (err) {
    console.error('Error fetching venues:', err);
    res.status(500).json({ message: 'Server error while fetching venues' });
  }
});

/**
 * Route to get a single venue by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    res.status(200).json(venue);
  } catch (err) {
    console.error('Error fetching venue:', err);
    res.status(400).json({ message: 'Invalid venue ID' });
  }
});

/**
 * Route to create a new venue
 */
router.post(
  '/',
  [
    body('occasionType').notEmpty().withMessage('Occasion type is required'),
    body('venueName').notEmpty().withMessage('Venue name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('capacity').isNumeric().withMessage('Capacity must be a number'),
    body('acceptedPayments').notEmpty().withMessage('Accepted payments are required'),
    body('imageUrl').isURL().withMessage('Image URL must be a valid URL'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
      res.status(500).json({ message: 'Server error while creating venue' });
    }
  }
);

/**
 * Route to update an existing venue
 */
router.put(
  '/:id',
  [
    body('venueName').optional().notEmpty().withMessage('Venue name cannot be empty'),
    body('capacity').optional().isNumeric().withMessage('Capacity must be a number'),
    body('imageUrl').optional().isURL().withMessage('Image URL must be a valid URL'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const updatedVenue = await Venue.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedVenue) {
        return res.status(404).json({ message: 'Venue not found' });
      }
      res.status(200).json(updatedVenue);
    } catch (err) {
      console.error('Error updating venue:', err);
      res.status(500).json({ message: 'Server error while updating venue' });
    }
  }
);

/**
 * Route to delete a venue
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedVenue = await Venue.findByIdAndDelete(req.params.id);
    if (!deletedVenue) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    res.status(200).json({ message: 'Venue deleted successfully' });
  } catch (err) {
    console.error('Error deleting venue:', err);
    res.status(500).json({ message: 'Server error while deleting venue' });
  }
});

module.exports = router;
