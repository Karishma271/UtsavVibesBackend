const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Define storage location for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Save images to uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Ensure unique file names
  },
});

// Set up multer upload
const upload = multer({ storage });

// Route to handle image uploads
router.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

module.exports = router;
