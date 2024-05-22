const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const prisma = new PrismaClient();

exports.createSubscription = asyncHandler(async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: 1000,
          product_data: {
            name: req.user.first_name + ' ' + req.user.last_name,
          },
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    client_reference_id: req.user.id.toString(),
    customer_email: req.user.email,
    success_url: `http://192.168.1.74/opportunities`,
    cancel_url: `http://192.168.1.74/opportunities`
  });

  res.status(200).json({ session: session.url });
});
