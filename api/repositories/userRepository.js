const db = require('../models');
const User = db.users;

class UserRepository {
  async findByPhone(phone) {
    return await User.findOne({ where: { phone } });
  }

  async findById(id) {
    return await User.findByPk(id);
  }

  async create(data) {
    return await User.create(data);
  }

  async update(user, data) {
    return await user.update(data);
  }
}

module.exports = new UserRepository();
