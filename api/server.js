require('dotenv').config();

const express = require('express');

const cors = require('cors');

const bodyParser = require('body-parser');

const db = require('./models');

const authRoutes = require('./routes/authRoutes');
const placeRoutes = require('./routes/placeRoutes');

const app = express();

app.use(cors());
app.use('/api/places', placeRoutes);

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
const rideRoutes =
require('./routes/rideRoutes');

app.use('/api/rides', rideRoutes);

db.sequelize.sync().then(() => {

  app.listen(process.env.PORT, () => {

    console.log(`Server running on port ${process.env.PORT}`);

  });

});