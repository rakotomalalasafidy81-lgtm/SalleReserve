const express = require('express');
const router = express.Router();
const {
  getReservations,
  getReservationById,
  createReservation,
  updateReservation,
  cancelReservation,
  getUserReservations,
  approveReservation,
  rejectReservation
} = require('../controllers/reservationController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getReservations);
router.get('/user/my-reservations', protect, getUserReservations);
router.get('/:id', protect, getReservationById);
router.post('/', protect, createReservation);
router.put('/:id', protect, updateReservation);
router.patch('/:id/cancel', protect, cancelReservation);
router.patch('/:id/approve', protect, authorize('admin'), approveReservation);
router.patch('/:id/reject', protect, authorize('admin'), rejectReservation);

module.exports = router;
