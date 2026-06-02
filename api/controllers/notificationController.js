const db = require('../models');

const Notification = db.notifications;
const moment = require('moment');
const User = db.users;
const { Op, fn, col, literal } = require('sequelize');

exports.getNotifications =
    async (req, res) => {

    const notifications =
        await Notification.findAll({
        where: {
        user_id:
            req.params.userId,
        },
        include: [

            {
                model: User,
                as: 'user',

                attributes: [
                    'id',
                    'first_name',
                    'last_name',
                    'phone',
                    'email',
                ],
            },
            {
                model: User,
                as: 'referenceUser',

                attributes: [
                    'id',
                    'first_name',
                    'last_name',
                    'phone',
                    'email',
                ],
            },

        ],
        order: [
        ['id', 'DESC'],
        ],
    });

    res.json({
        success: true,
        data: notifications,
    });
    };

exports.getUnreadCount =
async (req, res) => {

  const count =
      await Notification.count({
    where: {
      user_id:
          req.params.userId,
      is_read: 0,
    },
  });

  res.json({
    success: true,
    count,
  });
};