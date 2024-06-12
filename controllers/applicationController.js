const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.createApplication = asyncHandler(async (req, res) => {
  const application = await prisma.tourist_Application.create({
    data: {
      opportunityId: req.params.id * 1,
      touristId: req.user.id
    }
  });

  res.status(201).json({ application });
});

exports.getOpportunityApplications = asyncHandler(async (req, res) => {
  const applications = await prisma.opportunity.findUnique({
    where: {
      id: req.params.id * 1
    },
    select: {
      appliedTourists: {
        select: {
          tourist: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              gender: true,
              nationality: true,
              birthdate: true,
            }
          },
          status: true,
          createdAt: true,
        }
      }
    }
  });

  res.status(200).json({ applications: applications.appliedTourists });
});

exports.getTouristApplications = asyncHandler(async (req, res) => {
  const applications = await prisma.tourist_Application.findMany({
    where: {
      touristId: req.user.id
    },
    select: {
      opportunity: {
        select: {
          id: true,
          title: true,
          description: true,
          from: true,
          to: true,
          host: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
            }
          }
        }
      }
    }
  });

  res.status(200).json({ applications });
});

exports.deleteApplication = asyncHandler(async (req, res) => {
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

exports.acceptApplication = asyncHandler(async (req, res) => {
  await prisma.tourist_Application.update({
    where: {
      touristId_opportunityId: {
        opportunityId: req.body.opportunityId,
        touristId: req.body.touristId
      }
    },
    data: {
      status: 'PENDING',
    }
  });

  res.status(200).json();
});

exports.rejectApplication = asyncHandler(async (req, res) => {
  await prisma.tourist_Application.update({
    where: {
      touristId_opportunityId: {
        opportunityId: req.body.opportunityId,
        touristId: req.body.touristId
      }
    },
    data: {
      status: 'REJECTED',
    }
  });

  res.status(200).json();
});
