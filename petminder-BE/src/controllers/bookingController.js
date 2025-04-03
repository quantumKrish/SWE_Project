const bookingModel = require('../models/bookingModel');

const bookingController = {

  createBooking: async (req, res) => {
    try {
      const bookingData = req.body;
      const newBooking = await bookingModel.create(bookingData); 
      res.status(201).json({ bookingID: newBooking.bookingID }); 
    } catch (error) {
      console.error('Booking creation failed:', error);
      res.status(500).json({ error: error.message });
    }
  },
  
  getBookingByMinderId: async (req, res) => {
    try {
      const minderID = req.params.minderID;
      console.log(`Fetching bookings for minderID: ${minderID}`); // Debugging log
  
      const bookings = await bookingModel.findByMinderId(minderID);
      console.log('Retrieved Bookings:', bookings); // Log results
  
      if (!bookings || bookings.length === 0) {
        return res.status(404).json({ message: 'No bookings found' });
      }
  
      res.status(200).json(bookings);
    } catch (error) {
      console.error('Error fetching minder bookings:', error);
      res.status(500).json({ error: error.message });
    }
  },
  
  getBookingByOwnerId: async (req, res) => {
    try {
      const ownerID = req.params.ownerID;
      console.log(`Fetching bookings for ownerID: ${ownerID}`); // Debugging log
  
      const bookings = await bookingModel.findByOwnerId(ownerID);
      console.log('Retrieved Bookings:', bookings); // Log results
  
      if (!bookings || bookings.length === 0) {
        return res.status(404).json({ message: 'No bookings found' });
      }
  
      res.status(200).json(bookings);
    } catch (error) {
      console.error('Error fetching owner bookings:', error);
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
