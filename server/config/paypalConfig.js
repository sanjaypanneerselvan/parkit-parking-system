const paypal = require('@paypal/checkout-server-sdk');

// Set up PayPal environment
const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_KEY,
  process.env.PAYPAL_SECRET_KEY
);
const client = new paypal.core.PayPalHttpClient(environment);

module.exports = { client };
