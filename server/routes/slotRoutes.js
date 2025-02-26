const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');
const { authenticateUser } = require('../middleware/auth');

router.post('/book', authenticateUser, slotController.bookSlot);

module.exports = router;