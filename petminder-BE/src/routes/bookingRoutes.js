const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/', bookingController.createBooking);
router.get('/', bookingController.getAllBookings);
router.get('/owner/:ownerID', bookingController.getBookingByOwnerId);
router.get('/minder/:minderID', bookingController.getBookingByMinderId);
router.get('/:id', bookingController.getBookingById); // Keep this for getting a booking by ID

// Accept Booking
router.patch("/:id/accept", bookingController.acceptBooking);

// Reject Booking
router.patch("/:id/reject", bookingController.rejectBooking);

// cancel Booking
router.patch("/:id/cancel", bookingController.cancelBooking);

// complete Booking
router.patch("/:id/complete", bookingController.completeBooking);

router.put('/:id/status', bookingController.updateBookingStatus);
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;
