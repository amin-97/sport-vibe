const express = require("express");
const mongoose = require("mongoose");
const AWS = require("aws-sdk");
const multer = require("multer");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// AWS S3 configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Middleware
app.use(express.json());

// Multer configuration for file uploads
const upload = multer({ dest: "uploads/" });

// Define a simple route
app.get("/", (req, res) => {
  res.send("Hello, SportVibe!");
});

// File upload route
app.post("/upload", upload.single("image"), (req, res) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: req.file.filename,
    Body: fs.createReadStream(req.file.path),
  };

  s3.upload(params, (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send(data);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
