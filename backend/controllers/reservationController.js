const Reservation = require('../models/Reservation');
const Room = require('../models/Room');
const { sendReservationConfirmation, sendReservationCancellation } = require('../utils/email');

// ---------- Règles métier (constantes) ----------
const OPENING_HOUR = 7;   // 07h00
const CLOSING_HOUR = 19;  // 19h00

// ---------- Fonctions utilitaires ----------

// Convertit "HH:mm" en minutes depuis minuit
function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// L'heure de fin doit être après l'heure de début
function isTimeRangeValid(startTime, endTime) {
  return timeToMinutes(endTime) > timeToMinutes(startTime);
}

// Les salles ne sont réservables qu'entre 07h00 et 19h00
function isWithinOpeningHours(startTime, endTime) {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  return start >= OPENING_HOUR * 60 && end <= CLOSING_HOUR * 60;
}

// Impossible de réserver un créneau déjà passé (on combine date + heure de début,
// et on compare à l'heure serveur actuelle)
function isNotInPast(date, startTime) {
  const [hours, minutes] = startTime.split(':').map(Number);
  const reservationStart = new Date(date);
  reservationStart.setHours(hours, minutes, 0, 0);
  return reservationStart >= new Date();
}

// Cherche un chevauchement d'horaire pour une salle donnée (occupée par n'importe qui).
// On bloque sur les statuts "confirmed" ET "pending" : une réservation en attente
// d'approbation retient quand même le créneau tant qu'elle n'est pas refusée/annulée.
async function findRoomOverlap(room, date, startTime, endTime, excludeReservationId = null) {
  const query = {
    room,
    date,
    status: { $in: ['confirmed', 'pending'] }
  };
  if (excludeReservationId) {
    query._id = { $ne: excludeReservationId };
  }

  const candidates = await Reservation.find(query);
  const newStart = timeToMinutes(startTime);
  const newEnd = timeToMinutes(endTime);

  return candidates.find((r) => {
    const existingStart = timeToMinutes(r.startTime);
    const existingEnd = timeToMinutes(r.endTime);
    return existingStart < newEnd && existingEnd > newStart;
  }) || null;
}

// Cherche si CE MÊME utilisateur a déjà une réservation (dans une autre salle ou la même)
// qui chevauche ce créneau — un utilisateur ne peut pas être dans deux salles à la fois.
async function findUserOverlap(user, date, startTime, endTime, excludeReservationId = null) {
  const query = {
    user,
    date,
    status: { $in: ['confirmed', 'pending'] }
  };
  if (excludeReservationId) {
    query._id = { $ne: excludeReservationId };
  }

  const candidates = await Reservation.find(query);
  const newStart = timeToMinutes(startTime);
  const newEnd = timeToMinutes(endTime);

  return candidates.find((r) => {
    const existingStart = timeToMinutes(r.startTime);
    const existingEnd = timeToMinutes(r.endTime);
    return existingStart < newEnd && existingEnd > newStart;
  }) || null;
}

// Un utilisateur a-t-il déjà au moins une réservation active (peu importe la date) ?
// Sert à déterminer si la NOUVELLE réservation doit être auto-confirmée (1ère fois)
// ou mise en attente d'approbation admin (2e réservation et plus).
async function userHasActiveReservation(user, excludeReservationId = null) {
  const query = {
    user,
    status: { $in: ['confirmed', 'pending'] }
  };
  if (excludeReservationId) {
    query._id = { $ne: excludeReservationId };
  }
  const existing = await Reservation.findOne(query);
  return !!existing;
}

// ---------- Contrôleurs ----------

// @route   GET /api/reservations
// @desc    Récupérer toutes les réservations (Admin)
// @access  Private/Admin
exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('user', 'name email')
      .populate('room', 'name building')
      .sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: reservations.length,
      reservations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/reservations/user/my-reservations
// @desc    Récupérer mes réservations
// @access  Private
exports.getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id })
      .populate('room', 'name building capacity')
      .sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: reservations.length,
      reservations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/reservations/:id
// @desc    Récupérer une réservation
// @access  Private
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('user', 'name email')
      .populate('room', 'name building capacity');
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Réservation non trouvée' });
    }
    res.status(200).json({
      success: true,
      reservation
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   POST /api/reservations
// @desc    Créer une réservation
// @access  Private
exports.createReservation = async (req, res) => {
  try {
    const { room, date, startTime, endTime, purpose, notes } = req.body;

    if (!room || !date || !startTime || !endTime || !purpose) {
      return res.status(400).json({ success: false, message: 'Champs manquants pour la réservation' });
    }

    // La salle existe-t-elle ?
    const roomExists = await Room.findById(room);
    if (!roomExists) {
      return res.status(404).json({ success: false, message: 'Salle non trouvée' });
    }

    // Heure de fin après heure de début
    if (!isTimeRangeValid(startTime, endTime)) {
      return res.status(400).json({ success: false, message: 'L\'heure de fin doit être postérieure à l\'heure de début' });
    }

    // Horaires d'ouverture : 07h00 - 19h00
    if (!isWithinOpeningHours(startTime, endTime)) {
      return res.status(400).json({ success: false, message: 'Les salles sont réservables uniquement entre 07h00 et 19h00' });
    }

    // Pas de réservation dans le passé
    if (!isNotInPast(date, startTime)) {
      return res.status(400).json({ success: false, message: 'Impossible de réserver un créneau déjà passé' });
    }

    // La salle est-elle déjà prise sur ce créneau (par n'importe qui) ?
    const roomConflict = await findRoomOverlap(room, date, startTime, endTime);
    if (roomConflict) {
      return res.status(400).json({ success: false, message: 'Cette salle n\'est pas disponible à cette heure' });
    }

    // Cet utilisateur a-t-il déjà une autre salle réservée sur ce créneau ?
    const userConflict = await findUserOverlap(req.user.id, date, startTime, endTime);
    if (userConflict) {
      return res.status(400).json({ success: false, message: 'Vous avez déjà une réservation sur ce créneau dans une autre salle' });
    }

    // 1ère réservation active de l'utilisateur -> confirmée automatiquement
    // À partir de la 2e réservation active -> en attente d'approbation admin
    const alreadyHasReservation = await userHasActiveReservation(req.user.id);
    const status = alreadyHasReservation ? 'pending' : 'confirmed';

    const reservation = await Reservation.create({
      user: req.user.id,
      room,
      date,
      startTime,
      endTime,
      purpose,
      notes,
      status
    });

    await reservation.populate('room', 'name building capacity');

    // Email uniquement si la réservation est directement confirmée
    if (status === 'confirmed') {
      sendReservationConfirmation(req.user, reservation);
    }

    res.status(201).json({
      success: true,
      message: status === 'pending'
        ? 'Vous avez déjà une réservation active : celle-ci est en attente d\'approbation par l\'admin'
        : 'Réservation confirmée',
      reservation
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @route   PUT /api/reservations/:id
// @desc    Mettre à jour une réservation
// @access  Private
exports.updateReservation = async (req, res) => {
  try {
    let reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Réservation non trouvée' });
    }

    if (reservation.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Non autorisé' });
    }

    // Champs autorisés à la modification (jamais "user" ni "status" directement)
    const room = req.body.room !== undefined ? req.body.room : reservation.room;
    const date = req.body.date !== undefined ? req.body.date : reservation.date;
    const startTime = req.body.startTime !== undefined ? req.body.startTime : reservation.startTime;
    const endTime = req.body.endTime !== undefined ? req.body.endTime : reservation.endTime;
    const purpose = req.body.purpose !== undefined ? req.body.purpose : reservation.purpose;
    const notes = req.body.notes !== undefined ? req.body.notes : reservation.notes;

    const roomExists = await Room.findById(room);
    if (!roomExists) {
      return res.status(404).json({ success: false, message: 'Salle non trouvée' });
    }

    if (!isTimeRangeValid(startTime, endTime)) {
      return res.status(400).json({ success: false, message: 'L\'heure de fin doit être postérieure à l\'heure de début' });
    }

    if (!isWithinOpeningHours(startTime, endTime)) {
      return res.status(400).json({ success: false, message: 'Les salles sont réservables uniquement entre 07h00 et 19h00' });
    }

    if (!isNotInPast(date, startTime)) {
      return res.status(400).json({ success: false, message: 'Impossible de réserver un créneau déjà passé' });
    }

    const roomConflict = await findRoomOverlap(room, date, startTime, endTime, reservation._id);
    if (roomConflict) {
      return res.status(400).json({ success: false, message: 'Cette salle n\'est pas disponible à cette heure' });
    }

    const userConflict = await findUserOverlap(req.user.id, date, startTime, endTime, reservation._id);
    if (userConflict) {
      return res.status(400).json({ success: false, message: 'Vous avez déjà une réservation sur ce créneau dans une autre salle' });
    }

    reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { room, date, startTime, endTime, purpose, notes },
      { new: true, runValidators: true }
    ).populate('room', 'name building capacity');

    res.status(200).json({
      success: true,
      reservation
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @route   PATCH /api/reservations/:id/cancel
// @desc    Annuler une réservation
// @access  Private
exports.cancelReservation = async (req, res) => {
  try {
    let reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Réservation non trouvée' });
    }

    if (reservation.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Non autorisé' });
    }

    reservation.status = 'cancelled';
    await reservation.save();
    await reservation.populate('room', 'name building capacity');

    sendReservationCancellation(req.user, reservation);

    res.status(200).json({
      success: true,
      message: 'Réservation annulée',
      reservation
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PATCH /api/reservations/:id/approve
// @desc    Approuver une réservation en attente
// @access  Private/Admin
exports.approveReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate('user', 'name email');
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Réservation non trouvée' });
    }

    // On revérifie qu'aucun conflit n'est apparu entre-temps avant d'approuver
    const roomConflict = await findRoomOverlap(
      reservation.room, reservation.date, reservation.startTime, reservation.endTime, reservation._id
    );
    if (roomConflict) {
      return res.status(400).json({ success: false, message: 'Conflit détecté : la salle est désormais prise sur ce créneau' });
    }

    reservation.status = 'confirmed';
    await reservation.save();
    await reservation.populate('room', 'name building capacity');

    sendReservationConfirmation(reservation.user, reservation);

    res.status(200).json({ success: true, message: 'Réservation approuvée', reservation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PATCH /api/reservations/:id/reject
// @desc    Refuser une réservation en attente
// @access  Private/Admin
exports.rejectReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate('user', 'name email');
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Réservation non trouvée' });
    }

    reservation.status = 'cancelled';
    await reservation.save();
    await reservation.populate('room', 'name building capacity');

    sendReservationCancellation(reservation.user, reservation);

    res.status(200).json({ success: true, message: 'Réservation refusée', reservation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
    
