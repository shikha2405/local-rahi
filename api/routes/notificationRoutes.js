const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

const {
  getNotifications,
  getUnreadCount
} = require('../controllers/notificationController');

router.use(auth);
router.get('/:userId', getNotifications);
router.get('/unread-count/:userId', getUnreadCount);
module.exports = router;