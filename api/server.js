require('dotenv').config();

const express = require('express');

const cors = require('cors');

const bodyParser = require('body-parser');

const db = require('./models');

const authRoutes = require('./routes/authRoutes');
const placeRoutes = require('./routes/placeRoutes');
const rideRoutes = require('./routes/rideRoutes');
const rideBookingRoutes = require('./routes/rideBookingRoutes');
const rideRatingRoutes = require('./routes/rideRatingRoutes');
const notificationRoutes = require('./routes/notificationRoutes');


const app = express();

app.use(cors());
app.use('/api/places', placeRoutes);

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);


app.use('/api/rides', rideRoutes);
app.use('/api/ride-bookings', rideBookingRoutes);
app.use('/api/ride-ratings', rideRatingRoutes);
app.use('/api/notifications', notificationRoutes);

db.sequelize.sync().then(() => {

  app.listen(process.env.PORT, () => {

    console.log(`Server running on port ${process.env.PORT}`);

  });

});