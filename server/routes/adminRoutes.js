const express = require('express');
const router = express.Router();
const commonController = require('../controllers/commonController');
const adminController = require('../controllers/adminController');
const { authenticateAdmin } = require('../middleware/auth');

router.post('/register', adminController.register);
router.post('/login', adminController.login);

router.get('/sales-report', authenticateAdmin, adminController.getSalesReport);
router.put('/slot-price', authenticateAdmin, adminController.changeSlotPrice);
router.get('/malls', authenticateAdmin, commonController.getMalls); // Fetch all malls
router.get('/slots/:mall', authenticateAdmin, commonController.getSlotsByMall); // Fetch slots by mall
router.get('/system-status', adminController.getSystemStatus);
router.get('/todays-overview', adminController.getTodaysOverview);

module.exports = router;

