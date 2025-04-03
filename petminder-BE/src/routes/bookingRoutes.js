const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/', bookingController.createBooking);
router.get('/', bookingController.getAllBookings);
router.get('/owner/:ownerID', bookingController.getBookingByOwnerId);
router.get('/minder/:minderID', bookingController.getBookingByMinderId);
router.get('/:id', bookingController.getBookingById); // Keep this for getting a booking by ID


router.put('/:id/status', bookingController.updateBookingStatus);
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;
