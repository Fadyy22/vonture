const asyncHandler = require("express-async-handler");
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
  });

  res.status(200).json({ users });
});

exports.getMyProfile = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id
    },
    include: {
      receivedReviews: {
        select: {
          givenBy: {
            select: {
              first_name: true,
              last_name: true
            },
          },
          comment: true,
          rating: true,
        }
      },
      skills: {
        select: {
          name: true
        }
      },
    }
  });
  user.skills = user.skills.map(skill => skill.name);
  res.status(200).json({ user });
};

exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.params.id * 1
    },
    include: {
      place: true,
      receivedReviews: {
        select: {
          givenBy: {
            select: {
              id: true,
              first_name: true,
              last_name: true
            }
          },
          rating: true,
          comment: true,
          createdAt: true,
        }
      },
      skills: {
        select: {
          name: true
        }
      }
    }
  });

  delete user.password;
  user.skills = user.skills.map(skill => skill.name);

  return res.status(200).json({ user });
});
