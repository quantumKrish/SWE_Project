// Initialize the server, socket.io will need to be added later also authentication route once developed
require("dotenv").config();
console.log("JWT_SECRET:", process.env.JWT_SECRET); // Debugging line

const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const getUserRoute = require('./routes/getUserRoute');
const getMessageRoute = require('./routes/messageRoutes');
const bookingRoutes = require('./routes/bookingRoutes'); 


const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
// app.use('/location', locationRoutes); // to be added later
app.use('/getuser', getUserRoute); // to be added later
app.use('/message/', getMessageRoute);
app.use('/bookings', bookingRoutes); 

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// access endpoints in the frontend by using localhost with the port number and the endpoint so something like http://localhost:4000/location to access the location endpoint
