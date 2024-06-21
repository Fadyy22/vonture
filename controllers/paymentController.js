const asyncHandler = require('express-async-handler');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const prisma = new PrismaClient();

exports.getPaymentCheckout = asyncHandler(async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: 200,
          product_data: {
            name: req.user.first_name + ' ' + req.user.last_name,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      opportunityId: req.params.id,
      payment: true
    },
    mode: 'payment',
    client_reference_id: req.user.id.toString(),
    customer_email: req.user.email,
    success_url: `${req.protocol}://${req.get('host')}/payment_success.html`,
    cancel_url: `${req.protocol}://${req.get('host')}/payment_failure.html`
  });

  res.status(200).json({ session: session.url });
});

exports.createPayment = asyncHandler(async (event) => {
  await prisma.payment.create({
    data: {
      touristId: event.data.object.client_reference_id * 1,
      amount: 2,
    }
  });

  await prisma.tourist_Application.update({
    where: {
      touristId_opportunityId: {
        touristId: event.data.object.client_reference_id * 1,
        opportunityId: event.data.object.metadata.opportunityId * 1,
      }
    },
    data: {
      status: 'ACCEPTED'
    }
  });
});
