const asyncHandler = require('express-async-handler');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const prisma = new PrismaClient();

exports.getSubscriptionCheckout = asyncHandler(async (req, res) => {
  const plan = await prisma.plan.findUnique({
    where: { id: req.params.id * 1 },
  });
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: Math.ceil(plan.price * 100 + plan.price * 100 * (2.9 / 100) + 30),
          product_data: {
            name: req.user.first_name + ' ' + req.user.last_name,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      planId: req.params.id,
      subscription: true
    },
    mode: 'payment',
    client_reference_id: req.user.id.toString(),
    customer_email: req.user.email,
    success_url: `${req.protocol}://${req.get('host')}/payment_success.html`,
    cancel_url: `${req.protocol}://${req.get('host')}/payment_failure.html`
  });

  res.status(200).json({ session: session.url });
});

exports.createSubscription = asyncHandler(async (event) => {
  await prisma.payment.create({
    data: {
      touristId: event.data.object.client_reference_id * 1,
      amount: 10,
    }
  });

  await prisma.tourist_Plan.create({
    data: {
      touristId: event.data.object.client_reference_id * 1,
      planId: event.data.object.metadata.planId * 1,
    }
  });
});
