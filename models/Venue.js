const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
  occasionType: { type: String, required: true },
  venueName: { type: String, required: true },
  description: String,
  address: { type: String, required: true },
  capacity: Number,
  acceptedPayments: { type: [String], default: [] }, // Update this
  imageUrl: String,
});

const Venue = mongoose.model('Venue', VenueSchema);

module.exports = Venue;

