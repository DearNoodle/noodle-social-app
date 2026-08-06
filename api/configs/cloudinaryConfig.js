const cloudinary = require('cloudinary').v2;
const multer = require('multer');

const configCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      return cb(new Error('Only jpg, png or webp images are allowed'));
    }
    cb(null, true);
  },
});

function uploadToCloudinary(req) {
  return new Promise((resolve, reject) => {
    if (!req.file) {
      return resolve(null);
    }
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'noodle', resource_type: 'image' },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );
    stream.end(req.file.buffer);
  });
}

module.exports = { configCloudinary, upload, uploadToCloudinary };
