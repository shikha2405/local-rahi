const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('./userModel')(sequelize, DataTypes);
db.rides = require('./rideModel')(sequelize, DataTypes);
db.ride_bookings = require('./rideBookingModel')(sequelize, DataTypes);
db.rideRatings = require('./rideRatingModel')(sequelize,DataTypes);
Object.keys(db).forEach((modelName) => {

  if (db[modelName].associate) {

    db[modelName].associate(db);

  }

});

module.exports = db;