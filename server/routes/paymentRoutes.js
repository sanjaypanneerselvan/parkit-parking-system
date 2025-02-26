const express = require('express');
const { createOrder, capturePayment } = require('../controllers/paypalController');
const router = express.Router();

// Create PayPal order
router.post('/create-order', createOrder);

// Capture PayPal payment
router.post('/capture-payment', capturePayment);

module.exports = router;
