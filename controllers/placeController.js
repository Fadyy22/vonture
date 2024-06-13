const fs = require('fs');

const asyncHandler = require('express-async-handler');
const cloudinary = require('../utils/cloudinary');
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/places');
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1];
    const fileName = `place-${Date.now()}-${file.originalname}.${ext}`;
    cb(null, fileName);
  }
});

const upload = multer({ storage: multerStorage });

exports.parsePlaceImages = upload.array('images');

uploadPlaceImages = async (files, res) => {
  const images = await Promise.all(
    files.map(async file => {
      try {
        const { secure_url } = await cloudinary.uploader.upload(file.path);
        fs.unlinkSync(file.path);
        return secure_url;
      } catch (error) {
        fs.unlinkSync(file.path);
        return res.status(400).json({ error: 'Image upload failed' });
      }
    })
  );

  return images;
};

exports.createPlace = asyncHandler(async (req, res) => {
  req.body.hostId = req.user.id;
  if (req.files.length > 0) {
    req.body.placeMedia = await uploadPlaceImages(req.files, res);
    req.body.placeMedia = {
      create: req.body.placeMedia.map(media => ({ media }))
    };
  }

  const place = await prisma.place.create({
    data: req.body
  });

  res.status(201).json({ place });
});

exports.getAllPlaces = asyncHandler(async (req, res) => {
  const places = await prisma.place.findMany({
    select: {
      id: true,
      name: true,
      city: true,
      country: true,
      rating: true,
      host: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          rating: true
        }
      }
    }
  });

  res.status(200).json({ places });
});

exports.deletePlace = asyncHandler(async (req, res) => {
  const id = req.params.id * 1;

  await prisma.place.delete({
    where: { id }
  });

  res.status(204).json();
});
