const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Veuillez fournir un utilisateur']
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'Veuillez fournir une salle']
  },
  date: {
    type: Date,
    required: [true, 'Veuillez fournir une date']
  },
  startTime: {
    type: String,
    required: [true, 'Veuillez fournir l\'heure de début'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format d\'heure invalide (HH:mm)']
  },
  endTime: {
    type: String,
    required: [true, 'Veuillez fournir l\'heure de fin'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format d\'heure invalide (HH:mm)']
  },
  purpose: {
    type: String,
    required: [true, 'Veuillez fournir un motif'],
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour les requêtes fréquentes
reservationSchema.index({ user: 1, date: 1 });
reservationSchema.index({ room: 1, date: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);
