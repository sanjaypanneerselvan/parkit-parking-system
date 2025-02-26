const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

// Reset Password Route
router.put('/reset-password/:token', accountController.resetPassword);
// router.post('/free-pending-slots', accountController.freePendingSlots);
// router.post('/free-completed-slots', accountController.freeCompletedSlots);

module.exports = router;
