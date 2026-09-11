const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Veuillez fournir un nom de salle'],
    unique: true
  },
  building: {
    type: String,
    required: [true, 'Veuillez fournir le bâtiment'],
    enum: ['Belaza', 'Amphi', 'Principal', 'Elec', 'STIC']
  },
  capacity: {
    type: Number,
    required: [true, 'Veuillez fournir la capacité'],
    min: 1
  },
  description: {
    type: String,
    default: ''
  },
  equipment: {
    type: [String],
    default: []
  },
  available: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Room', roomSchema);
