const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.createApplication = asyncHandler(async (req, res, next) => {
  const application = await prisma.tourist_Application.create({
    data: {
      opportunityId: req.params.id * 1,
      touristId: req.user.id
    }
  });

  res.status(201).json({ application });
});

exports.getOpportunityApplications = asyncHandler(async (req, res, next) => {
  const applications = await prisma.tourist_Application.findMany({
    where: {
      opportunityId: req.params.id * 1,
    },
    select: {
      tourist: {
        select: {
          id: true,
          name: true,
          email: true,
          phone_number: true,
          nationality: true,
          gender: true,
          birthdate: true,
        }
      },
      status: true,
      createdAt: true,
    },
  });

  res.status(200).json({ applications });
});

exports.deleteApplication = asyncHandler(async (req, res, next) => {
  const opportunityId = req.params.id * 1;

  await prisma.tourist_Application.delete({
    where: {
      touristId_opportunityId: {
        opportunityId,
        touristId: req.user.id
      }
    }
  });

  res.status(204).json();
});
