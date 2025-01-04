// server/controllers/editorialController.js
const Editorial = require("../models/Editorial");
const { uploadToS3, deleteFromS3 } = require("../utils/s3");

// Get all editorials
exports.getAllEditorials = async (req, res) => {
  try {
    const editorials = await Editorial.find()
      .populate("author", "displayName")
      .sort({ createdAt: -1 });
    res.json(editorials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get editorial by ID
exports.getEditorialById = async (req, res) => {
  try {
    const editorial = await Editorial.findById(req.params.id)
      .populate("author", "displayName")
      .populate("relatedContent.item");
    if (!editorial) {
      return res.status(404).json({ message: "Editorial not found" });
    }
    res.json(editorial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get editorials by category
exports.getEditorialsByCategory = async (req, res) => {
  try {
    const editorials = await Editorial.find({ category: req.params.category })
      .populate("author", "displayName")
      .sort({ createdAt: -1 });
    res.json(editorials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create editorial
exports.createEditorial = async (req, res) => {
  try {
    const {
      title,
      category,
      summary,
      content,
      keyArguments,
      topics,
      status,
      featured,
      relatedContent,
    } = req.body;

    // Calculate reading time
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);

    const editorialData = {
      title,
      category,
      summary,
      content,
      keyArguments: keyArguments ? JSON.parse(keyArguments) : [],
      topics: topics ? JSON.parse(topics) : [],
      status: status || "published",
      featured: featured === "true",
      author: req.user._id,
      relatedContent: relatedContent ? JSON.parse(relatedContent) : [],
      readingTime,
    };

    // Handle image upload
    if (req.file) {
      const uploadResult = await uploadToS3(req.file, "editorial-images");
      editorialData.image = {
        url: uploadResult.url,
        key: uploadResult.key,
      };
    }

    const editorial = await Editorial.create(editorialData);
    res.status(201).json(editorial);
  } catch (error) {
    console.error("Error creating editorial:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update editorial
exports.updateEditorial = async (req, res) => {
  try {
    const editorial = await Editorial.findById(req.params.id);
    if (!editorial) {
      return res.status(404).json({ message: "Editorial not found" });
    }

    // Check if user is the author
    if (editorial.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Calculate reading time if content is updated
    let readingTime = editorial.readingTime;
    if (req.body.content) {
      const wordsPerMinute = 200;
      const wordCount = req.body.content.split(/\s+/).length;
      readingTime = Math.ceil(wordCount / wordsPerMinute);
    }

    const updates = {
      ...req.body,
      keyArguments: req.body.keyArguments
        ? JSON.parse(req.body.keyArguments)
        : editorial.keyArguments,
      topics: req.body.topics ? JSON.parse(req.body.topics) : editorial.topics,
      relatedContent: req.body.relatedContent
        ? JSON.parse(req.body.relatedContent)
        : editorial.relatedContent,
      featured: req.body.featured === "true",
      readingTime,
    };

    // Handle image update
    if (req.file) {
      // Delete old image if it exists
      if (editorial.image?.key) {
        await deleteFromS3(editorial.image.key);
      }

      const uploadResult = await uploadToS3(req.file, "editorial-images");
      updates.image = {
        url: uploadResult.url,
        key: uploadResult.key,
      };
    }

    const updatedEditorial = await Editorial.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    res.json(updatedEditorial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete editorial
exports.deleteEditorial = async (req, res) => {
  try {
    const editorial = await Editorial.findById(req.params.id);
    if (!editorial) {
      return res.status(404).json({ message: "Editorial not found" });
    }

    // Check if user is the author
    if (editorial.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Delete associated image if it exists
    if (editorial.image?.key) {
      await deleteFromS3(editorial.image.key);
    }

    await editorial.remove();
    res.json({ message: "Editorial deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;
