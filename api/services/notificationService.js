const db = require('../models');
const notificationRepository = require('../repositories/notificationRepository');

class NotificationService {
  async getNotifications(userId) {
    return await notificationRepository.findAll({
      where: {
        user_id: userId,
      },
      include: [
        {
          model: db.users,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'phone', 'email'],
        },
        {
          model: db.users,
          as: 'referenceUser',
          attributes: ['id', 'first_name', 'last_name', 'phone', 'email'],
        },
      ],
      order: [['id', 'DESC']],
    });
  }

  async getUnreadCount(userId) {
    return await notificationRepository.count({
      where: {
        user_id: userId,
        is_read: 0,
      },
    });
  }
}

module.exports = new NotificationService();
