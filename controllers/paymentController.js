const asyncHandler = require('express-async-handler');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const { touristPaymentSubject, touristPaymentText } = require('../utils/emailText');
const sendEmail = require('../utils/sendEmail');

const prisma = new PrismaClient();

exports.getPaymentCheckout = asyncHandler(async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: Math.ceil(200 + 200 * (2.9 / 100) + 30),
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

  const opportunity = await prisma.opportunity.findUnique({
    where: { id: event.data.object.metadata.opportunityId * 1 },
    select: {
      place: {
        select: {
          name: true
        }
      }
    }
  });

  const tourist = await prisma.user.findUnique({
    where: { id: event.data.object.client_reference_id * 1 },
  });

  const host = await prisma.opportunity.findUnique({
    where: { id: event.data.object.metadata.opportunityId * 1 },
    select: {
      host: {
        select: {
          first_name: true,
          last_name: true,
          email: true
        }
      }
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

  try {
    await sendEmail({
      to: host.email,
      subject: touristPaymentSubject(),
      text: touristPaymentText(host, tourist, opportunity)
    });
  } catch (error) {
    return res.status(500).json({ error: 'Email could not be sent' });
  }

});
