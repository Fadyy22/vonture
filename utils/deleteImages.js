const fs = require('fs');

const deleteImage = (req) => {
  if (req.file) {
    fs.unlinkSync(req.file.path);
  }
  if (req.files) {
    req.files.forEach(file => fs.unlinkSync(file.path));
  }
};

module.exports = deleteImage;
