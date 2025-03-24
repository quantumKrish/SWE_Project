const express = require('express');
const userRoutes = require('./routes/userRoutes');
// const authRoutes = require('./routes/authRoutes'); // Uncomment when ready
// const locationRoutes = require('./routes/locationRoutes');
// const messageRoutes = require('./routes/messageRoutes');
// const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/users', userRoutes);
// app.use('/auth', authRoutes);
// app.use('/location', locationRoutes);
// app.use('/messages', messageRoutes);
// app.use('/bookings', bookingRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
