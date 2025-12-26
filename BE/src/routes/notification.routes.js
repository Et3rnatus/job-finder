const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');

router.get('/:user_id', notificationController.getNotifications);

module.exports = router;