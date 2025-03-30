const bookingModel = require('../models/bookingModel');

const bookingController = {

  createBooking: async (req, res) => {
    try {
      const bookingData = req.body;
      const newBooking = await bookingModel.create(bookingData); 
      res.status(201).json({ bookingId: newBooking.id }); 
    } catch (error) {
      console.error('Booking creation failed:', error);
      res.status(500).json({ error: error.message });
    }
  },


  getBookingById: async (req, res) => {
    try {
      const bookingId = req.params.id;
      const booking = await bookingModel.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      res.status(200).json(booking);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  
  getAllBookings: async (req, res) => {
    try {
      const bookings = await bookingModel.findAll();
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  
  updateBookingStatus: async (req, res) => {
    try {
      const bookingId = req.params.id;
      const { newStatus } = req.body;
      const updatedBooking = await bookingModel.updateStatus(bookingId, newStatus);
      res.status(200).json(updatedBooking);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },


  deleteBooking: async (req, res) => {
    try {
      const bookingId = req.params.id;
      await bookingModel.delete(bookingId);
      res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = bookingController;
