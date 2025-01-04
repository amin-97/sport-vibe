// server/controllers/wrestlingResultsController.js
const WrestlingResult = require("../models/WrestlingResult");
const { uploadToS3, deleteFromS3 } = require("../utils/s3");

exports.createResult = async (req, res) => {
  try {
    const { name, date, venue, promotion } = req.body;
    let matches = JSON.parse(req.body.matches);

    const resultData = {
      name,
      date,
      venue,
      promotion,
      matches,
      author: req.user._id,
    };

    // Handle cover image
    if (req.files?.coverImage) {
      const coverImage = req.files.coverImage[0];
      const uploadResult = await uploadToS3(coverImage, "wrestling-results");
      resultData.coverImage = {
        url: uploadResult.url,
        key: uploadResult.key,
      };
    }

    // Handle additional images
    if (req.files?.additionalImages) {
      resultData.additionalImages = await Promise.all(
        req.files.additionalImages.map(async (file) => {
          const uploadResult = await uploadToS3(file, "wrestling-results");
          return {
            url: uploadResult.url,
            key: uploadResult.key,
          };
        })
      );
    }

    const result = await WrestlingResult.create(resultData);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating result:", error);
    res.status(500).json({ message: error.message });
  }
};
