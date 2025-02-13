// server/controllers/wrestlingResultsController.js
const WrestlingResult = require("../models/WrestlingResult");
const { uploadToS3, deleteFromS3 } = require("../utils/s3");

// Get all wrestling results
// Get all wrestling results
exports.getAllWrestlingResults = async (req, res) => {
  try {
    // Check if user is admin to include drafts
    const statusQuery = req.user?.isAdmin ? {} : { status: "published" };

    const results = await WrestlingResult.find(statusQuery)
      .populate("author", "displayName")
      .sort({ date: -1 });
    res.json(results);
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get wrestling result by slug
exports.getWrestlingResultBySlug = async (req, res) => {
  try {
    // Allow admins to view drafts
    const statusQuery = req.user?.isAdmin ? {} : { status: "published" };

    const result = await WrestlingResult.findOne({
      slug: req.params.slug,
      ...statusQuery,
    }).populate("author", "displayName");

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error fetching result:", error);
    res.status(500).json({ message: error.message });
  }
};
// Get wrestling results by promotion
exports.getWrestlingResultsByPromotion = async (req, res) => {
  try {
    // Include drafts for admin users
    const statusQuery = req.user?.isAdmin ? {} : { status: "published" };

    const results = await WrestlingResult.find({
      promotion: req.params.promotion.toUpperCase(),
      ...statusQuery,
    })
      .populate("author", "displayName")
      .sort({ date: -1 });
    res.json(results);
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.createWrestlingResult = async (req, res) => {
  try {
    const { name, date, venue, promotion, matches, status } = req.body;

    const resultData = {
      name,
      date,
      venue,
      promotion,
      matches: JSON.parse(matches),
      status: status || "published",
      author: req.user._id,
    };

    // Handle cover image
    if (req.files?.coverImage) {
      const coverImage = req.files.coverImage[0];
      const uploadResult = await uploadToS3(coverImage, "wrestling-results");
      resultData.coverImage = {
        url: uploadResult.url,
        publicId: uploadResult.key,
      };
    }

    // Handle additional images
    if (req.files?.additionalImages) {
      resultData.additionalImages = await Promise.all(
        req.files.additionalImages.map(async (file) => {
          const uploadResult = await uploadToS3(file, "wrestling-results");
          return {
            url: uploadResult.url,
            publicId: uploadResult.key,
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

exports.getDrafts = async (req, res) => {
  try {
    const drafts = await WrestlingResult.find({ status: "draft" })
      .populate("author", "displayName")
      .sort({ updatedAt: -1 });
    res.json(drafts);
  } catch (error) {
    console.error("Error fetching drafts:", error);
    res.status(500).json({ message: error.message });
  }
};

// Add this to wrestlingResultsController.js
exports.deleteWrestlingResult = async (req, res) => {
  try {
    const result = await WrestlingResult.findOne({ slug: req.params.slug });
    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    // Check if user is the author
    if (result.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Delete associated images if they exist
    if (result.coverImage?.publicId) {
      await deleteFromS3(result.coverImage.publicId);
    }

    if (result.additionalImages?.length) {
      await Promise.all(
        result.additionalImages.map((img) => deleteFromS3(img.publicId))
      );
    }

    await result.deleteOne();
    res.json({ message: "Wrestling result deleted successfully" });
  } catch (error) {
    console.error("Error deleting result:", error);
    res.status(500).json({ message: error.message });
  }
};

// In server/controllers/wrestlingResultsController.js
exports.updateWrestlingResult = async (req, res) => {
  try {
    const { name, date, venue, promotion, matches, status } = req.body;

    // Find the existing result by slug instead of ID
    const existingResult = await WrestlingResult.findOne({
      slug: req.params.slug,
    });
    if (!existingResult) {
      return res.status(404).json({ message: "Result not found" });
    }

    // Prepare update data
    const updateData = {
      name,
      date: new Date(date),
      venue,
      promotion,
      matches: JSON.parse(matches),
      status: status || existingResult.status,
    };

    // Handle cover image update
    if (req.files?.coverImage) {
      // Delete old cover image if it exists
      if (existingResult.coverImage?.publicId) {
        await deleteFromS3(existingResult.coverImage.publicId);
      }

      const coverImage = req.files.coverImage[0];
      const uploadResult = await uploadToS3(coverImage, "wrestling-results");
      updateData.coverImage = {
        url: uploadResult.url,
        publicId: uploadResult.key,
      };
    }

    // Handle additional images
    if (req.files?.additionalImages) {
      // Delete old additional images if they exist
      if (existingResult.additionalImages?.length) {
        await Promise.all(
          existingResult.additionalImages.map((img) =>
            deleteFromS3(img.publicId)
          )
        );
      }

      updateData.additionalImages = await Promise.all(
        req.files.additionalImages.map(async (file) => {
          const uploadResult = await uploadToS3(file, "wrestling-results");
          return {
            url: uploadResult.url,
            publicId: uploadResult.key,
          };
        })
      );
    }

    // Update the result
    const updatedResult = await WrestlingResult.findOneAndUpdate(
      { slug: req.params.slug },
      updateData,
      { new: true }
    );

    res.json(updatedResult);
  } catch (error) {
    console.error("Error updating result:", error);
    res.status(500).json({ message: error.message });
  }
};
