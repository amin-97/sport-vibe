// server/controllers/newsController.js
const News = require("../models/News");
const { uploadToS3, deleteFromS3 } = require("../utils/s3");

// Get all news
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find()
      .populate("author", "displayName")
      .sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get news by ID
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate(
      "author",
      "displayName"
    );
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get news by category
exports.getNewsByCategory = async (req, res) => {
  try {
    const news = await News.find({ category: req.params.category })
      .populate("author", "displayName")
      .sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create news
exports.createNews = async (req, res) => {
  try {
    const { title, category, description, content, tags } = req.body;

    const newsData = {
      title,
      category,
      description,
      content,
      tags: tags ? JSON.parse(tags) : [],
      author: req.user._id,
    };

    if (req.file) {
      const uploadResult = await uploadToS3(req.file, "news-images");
      newsData.image = {
        url: uploadResult.url,
        key: uploadResult.key,
      };
    }

    const news = await News.create(newsData);
    res.status(201).json(news);
  } catch (error) {
    console.error("Error creating news:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update news
exports.updateNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    // Check if user is the author
    if (news.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updates = {
      ...req.body,
      tags: req.body.tags ? JSON.parse(req.body.tags) : news.tags,
    };

    // Handle image update
    if (req.file) {
      // Delete old image if it exists
      if (news.image?.key) {
        await deleteFromS3(news.image.key);
      }

      const uploadResult = await uploadToS3(req.file, "news-images");
      updates.image = {
        url: uploadResult.url,
        key: uploadResult.key,
      };
    }

    const updatedNews = await News.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    res.json(updatedNews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete news
exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    // Check if user is the author
    if (news.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Delete associated image if it exists
    if (news.image?.key) {
      await deleteFromS3(news.image.key);
    }

    await news.remove();
    res.json({ message: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
