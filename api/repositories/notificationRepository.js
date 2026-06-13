const db = require('../models');
const Notification = db.notifications;

class NotificationRepository {
  async findAll(options) {
    return await Notification.findAll(options);
  }

  async count(options) {
    return await Notification.count(options);
  }
}

module.exports = new NotificationRepository();
