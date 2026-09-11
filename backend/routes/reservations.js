const express = require('express');
const router = express.Router();
const {
  getReservations,
  getReservationById,
  createReservation,
  updateReservation,
  cancelReservation,
  getUserReservations
} = require('../controllers/reservationController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getReservations);
router.get('/user/my-reservations', protect, getUserReservations);
router.get('/:id', protect, getReservationById);
router.post('/', protect, createReservation);
router.put('/:id', protect, updateReservation);
router.patch('/:id/cancel', protect, cancelReservation);

module.exports = router;
