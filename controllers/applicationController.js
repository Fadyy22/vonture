const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');

const sendEmail = require('../utils/sendEmail');
const { acceptanceText, acceptanceSubject, rejectionSubject, rejectionText } = require('../utils/emailText');
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
      },
      status: true
    }
  });

  applications.forEach(application => {
    application.opportunity.from = application.opportunity.from.toISOString().split('T')[0];
    application.opportunity.to = application.opportunity.to.toISOString().split('T')[0];
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
  const application = await prisma.tourist_Application.update({
    where: {
      touristId_opportunityId: {
        opportunityId: req.body.opportunityId,
        touristId: req.body.touristId
      }
    },
    include: {
      tourist: {
        select: {
          first_name: true,
          last_name: true,
          email: true,
        }
      },
      opportunity: {
        select: {
          title: true,
          place: {
            select: {
              name: true,
            }
          },
          from: true,
          to: true,
        }
      }
    },
    data: {
      status: 'PENDING',
    }
  });

  try {
    await sendEmail({
      to: 'fadyalaa441@gmail.com',
      subject: acceptanceSubject(application),
      text: acceptanceText(application)
    });
  } catch (error) {
    return res.status(500).json({ error: 'Email could not be sent' });
  }

  res.status(200).json();
});

exports.rejectApplication = asyncHandler(async (req, res) => {
  const application = await prisma.tourist_Application.update({
    where: {
      touristId_opportunityId: {
        opportunityId: req.body.opportunityId,
        touristId: req.body.touristId
      }
    },
    include: {
      tourist: {
        select: {
          first_name: true,
          last_name: true,
          email: true,
        }
      },
      opportunity: {
        select: {
          title: true,
          place: {
            select: {
              name: true,
            }
          },
          from: true,
          to: true,
        }
      }
    },
    data: {
      status: 'REJECTED',
    }
  });

  try {
    await sendEmail({
      to: 'fadyalaa441@gmail.com',
      subject: rejectionSubject(application),
      text: rejectionText(application)
    });
  } catch (error) {
    return res.status(500).json({ error: 'Email could not be sent' });
  }

  res.status(200).json();
});
