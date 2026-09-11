const Room = require('../models/Room');

// @route   GET /api/rooms
// @desc    Récupérer toutes les salles
// @access  Public
exports.getRooms = async (req, res) => {
  try {
    const { building, capacity } = req.query;
    let query = {};

    if (building) query.building = building;
    if (capacity) query.capacity = { $gte: capacity };

    const rooms = await Room.find(query).sort({ building: 1, name: 1 });
    res.status(200).json({
      success: true,
      count: rooms.length,
      rooms
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/rooms/:id
// @desc    Récupérer une salle
// @access  Public
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Salle non trouvée' });
    }
    res.status(200).json({
      success: true,
      room
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   POST /api/rooms
// @desc    Créer une salle
// @access  Private/Admin
exports.createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json({
      success: true,
      room
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @route   PUT /api/rooms/:id
// @desc    Mettre à jour une salle
// @access  Private/Admin
exports.updateRoom = async (req, res) => {
  try {
    let room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Salle non trouvée' });
    }
    room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({
      success: true,
      room
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @route   DELETE /api/rooms/:id
// @desc    Supprimer une salle
// @access  Private/Admin
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Salle non trouvée' });
    }
    res.status(200).json({
      success: true,
      message: 'Salle supprimée'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
