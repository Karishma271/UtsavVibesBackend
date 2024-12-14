const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Set up storage configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // Store in the uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use unique filenames
  },
});

const upload = multer({ storage: storage });

// Upload route to handle single image upload
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageUrl = req.file.filename; // Get the filename of the uploaded image
  res.status(200).json({ message: "File uploaded successfully", imageUrl });
});

module.exports = router;
