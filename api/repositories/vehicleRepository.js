const db = require('../models');
const Vehicle = db.vehicles;

class VehicleRepository {
  async findOrCreate(options) {
    return await Vehicle.findOrCreate(options);
  }

  async findAll(options) {
    return await Vehicle.findAll(options);
  }
}

module.exports = new VehicleRepository();
