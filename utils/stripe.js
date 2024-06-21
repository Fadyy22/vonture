const stripe = require('stripe');

const { createSubscription } = require('../controllers/subscriptionController');
const { createPayment } = require('../controllers/paymentController');


exports.webhookCheckout = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_KEY);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {

    if (event.data.object.metadata.payment) {
      createPayment(event);
    } else if (event.data.object.metadata.subscription) {
      createSubscription(event);
    }
  }

  res.status(200).end();

};
