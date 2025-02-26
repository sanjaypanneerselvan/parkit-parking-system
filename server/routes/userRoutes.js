const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const commonController = require('../controllers/commonController');
const { authenticateUser } = require('../middleware/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/reset-password', userController.resetPassword);
router.get('/malls', commonController.getMalls); // Fetch all malls
router.get('/slots/:mall', commonController.getSlotsByMall); // Fetch slots by mall
router.post('/pay', authenticateUser, userController.payForBooking);
router.get('/bookings', authenticateUser, userController.getUserBookings);
router.get('/slot/:slotId', authenticateUser, commonController.getSlotById);

module.exports = router;

