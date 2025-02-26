const paypal = require('@paypal/checkout-server-sdk');
const { client } = require('../config/paypalConfig');

// Create PayPal order
exports.createOrder = async (req, res) => {
  const { amount } = req.body;

  const request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: amount,
        },
      },
    ],
  });

  try {
    const order = await client.execute(request);
    console.log(order);
    res.status(200).json({ id: order.result.id });
  } catch (error) {
    console.error('PayPal Order Creation Error:', error.message);
    res.status(500).json({ message: 'Order creation failed', error: error.message });
  }  
};

// Capture PayPal payment
exports.capturePayment = async (req, res) => {
  const { orderId } = req.body;

  const request = new paypal.orders.OrdersCaptureRequest(orderId);

  try {
    const capture = await client.execute(request);
    res.status(200).json({ message: 'Payment successful', capture });
  } catch (error) {
    console.error('Error capturing PayPal payment:', error);
    res.status(500).json({ message: 'Error capturing PayPal payment' });
  }
};
