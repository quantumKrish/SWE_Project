// Initialize the server socket.io will need to be added later also authentication route once developed

const express = require('express');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/auth', authRoutes); // to be added later
app.use('/users', userRoutes);
app.use('/location', locationRoutes); // to be added later
app.use('/messages', messageRoutes); // to be added later
app.use('/bookings', bookingRoutes); // to be added later

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// access endpoints in the frontend by using localhost with the port number and the endpoint so something like http://localhost:3000/location to access the location endpoint