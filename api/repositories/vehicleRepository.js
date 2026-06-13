const db = require('../models');
const Vehicle = db.vehicles;

class VehicleRepository {
  async findOrCreate(options) {
    return await Vehicle.findOrCreate(options);
  }

  async findAll(options) {
    return await Vehicle.findAll(options);
  }

  async findById(id) {
    return await Vehicle.findByPk(id);
  }

  async create(data) {
    return await Vehicle.create(data);
  }
}

module.exports = new VehicleRepository();
