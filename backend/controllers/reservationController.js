const Reservation = require('../models/Reservation');
const Room = require('../models/Room');
const { sendReservationConfirmation, sendReservationCancellation } = require('../utils/email');

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
    const { room, date, startTime, endTime, purpose } = req.body;

    // Vérifier si la salle existe
    const roomExists = await Room.findById(room);
    if (!roomExists) {
      return res.status(404).json({ success: false, message: 'Salle non trouvée' });
    }

    // Vérifier si la salle est disponible
    const existingReservation = await Reservation.findOne({
      room,
      date,
      status: { $ne: 'cancelled' },
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } },
        { endTime: { $gt: startTime, $lte: endTime } }
      ]
    });

    if (existingReservation) {
      return res.status(400).json({ success: false, message: 'Cette salle n\'est pas disponible à cette heure' });
    }

    const reservation = await Reservation.create({
      user: req.user.id,
      room,
      date,
      startTime,
      endTime,
      purpose,
      status: 'confirmed'
    });

    await reservation.populate('room', 'name building capacity');

    // Envoi de l'email de confirmation (n'empêche pas la réservation si ça échoue)
    sendReservationConfirmation(req.user, reservation);

    res.status(201).json({
      success: true,
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

    // Vérifier que l'utilisateur est le propriétaire
    if (reservation.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Non autorisé' });
    }

    reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('room', 'name building capacity');

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

    // Vérifier que l'utilisateur est le propriétaire
    if (reservation.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Non autorisé' });
    }

    reservation.status = 'cancelled';
    await reservation.save();
    await reservation.populate('room', 'name building capacity');

    // Envoi de l'email d'annulation (n'empêche pas l'annulation si ça échoue)
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
