const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
  occasionType: { type: String, required: true },
  venueName: { type: String, required: true },
  description: String,
  address: { type: String, required: true },
  capacity: Number,
  acceptedPayments: { type: [String], default: [] },
  imageUrl: { type: String }, // Store the image URL or image data in binary format
});

const Venue = mongoose.model('Venue', VenueSchema);

module.exports = Venue;
