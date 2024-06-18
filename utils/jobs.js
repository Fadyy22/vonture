const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');
const { scheduleJob } = require('node-schedule');

const prisma = new PrismaClient();

const updateExpiredOpportunitiesJob = scheduleJob('0 0 * * *', asyncHandler(async () => {
  let opportunities = await prisma.opportunity.findMany({
    where: {
      from: {
        lte: new Date()
      }
    },
    select: {
      id: true
    }
  });

  opportunities = opportunities.map(opportunity => opportunity.id);

  await prisma.opportunity.updateMany({
    where: {
      id: {
        in: opportunities
      },
    },
    data: {
      status: 'CLOSED'
    }
  });
}));

const jobs = () => {
  updateExpiredOpportunitiesJob;
};

module.exports = jobs;
