const mongoose = require('mongoose');

const organizerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
  contactNumber: { type: String, required: true },
});

module.exports = mongoose.model('Organizer', organizerSchema);
