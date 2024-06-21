const fs = require('fs');

const asyncHandler = require("express-async-handler");
const cloudinary = require('../utils/cloudinary');
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profile_images');
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1];
    const fileName = `profile-${Date.now()}-${file.originalname}.${ext}`;
    cb(null, fileName);
  }
});

const upload = multer({ storage: multerStorage });

exports.parseProfileImage = upload.single('profile_img');

const uploadProfileImage = async (file, res) => {
  try {
    const { secure_url } = await cloudinary.uploader.upload(file.path);
    fs.unlinkSync(file.path);
    return secure_url;
  } catch (error) {
    fs.unlinkSync(file.path);
    return res.status(400).json({ error: 'Image upload failed' });
  }
};

exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
  });

  res.status(200).json({ users });
});

exports.getMyProfile = asyncHandler(async (req, res) => {
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
});

exports.getUserProfile = asyncHandler(async (req, res) => {
  let applicationStatus;
  req.body.opportunityId ? applicationStatus = {
    toursitApplications: {
      where: {
        opportunityId: req.body.opportunityId * 1
      },
      select: {
        status: true
      }
    }
  } : {};

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
      },
      ...applicationStatus
    }
  });

  user.gender = user.gender === 'MALE' ? 'Male' : 'Female';
  user.age = new Date().getFullYear() - new Date(user.birthdate).getFullYear();
  user.skills = user.skills.map(skill => skill.name);
  user.status = user.toursitApplications && user.toursitApplications.length > 0 ? user.toursitApplications[0].status : null;
  user.status === null ? delete user.status : null;
  delete user.password;
  delete user.toursitApplications;
  return res.status(200).json({ user });
});

exports.createProfileImage = asyncHandler(async (req, res) => {
  if (req.file) {
    const profile_img = await uploadProfileImage(req.file, res);
    const user = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        profile_img
      }
    });
    return res.status(201).json({ user });
  }
  return res.status(400).json({ message: "Error uploading image" });
});
