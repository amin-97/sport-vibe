// server/controllers/newsController.js
const WrestlingNews = require("../models/WrestlingNews");
const { uploadToS3, deleteFromS3 } = require("../utils/s3");

// Get all news
exports.getAllWrestlingNews = async (req, res) => {
  try {
    const news = await WrestlingNews.find()
      .populate("author", "displayName")
      .sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get news by ID
exports.getWrestlingNewsById = async (req, res) => {
  try {
    const news = await WrestlingNews.findById(req.params.id).populate(
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

// In newsController.js, add a new method:
exports.getWrestlingNewsBySlug = async (req, res) => {
  try {
    const news = await WrestlingNews.findOne({
      slug: req.params.slug,
    }).populate("author", "displayName");
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// In news routes file, add a new route:

// Get news by category
exports.getWrestlingNewsByCategory = async (req, res) => {
  try {
    const news = await WrestlingNews.find({ category: req.params.category })
      .populate("author", "displayName")
      .sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create news
// server/controllers/wrestlingNewsController.js
exports.createWrestlingNews = async (req, res) => {
  try {
    const { title, category, description, content, tags, status } = req.body;

    const wrestlingNewsData = {
      title,
      category,
      description,
      content,
      tags: tags ? JSON.parse(tags) : [],
      status: status || "published", // Add this line
      author: req.user._id,
    };

    if (req.file) {
      const uploadResult = await uploadToS3(req.file, "news-images");
      wrestlingNewsData.image = {
        url: uploadResult.url,
        key: uploadResult.key,
      };
    }

    const news = await WrestlingNews.create(wrestlingNewsData);
    res.status(201).json(news);
  } catch (error) {
    console.error("Error creating news:", error);
    res.status(500).json({ message: error.message });
  }
};

// Add this to wrestlingNewsController.js
exports.getWrestlingNewsDrafts = async (req, res) => {
  try {
    const drafts = await WrestlingNews.find({
      status: "draft",
      author: req.user._id,
    })
      .populate("author", "displayName")
      .sort({ updatedAt: -1 });
    res.json(drafts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update news
exports.updateWrestlingNews = async (req, res) => {
  try {
    const news = await WrestlingNews.findById(req.params.id);
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

    const updatedWrestlingNews = await WrestlingNews.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
      }
    );

    res.json(updatedWrestlingNews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateWrestlingNewsBySlug = async (req, res) => {
  try {
    // Find the news by slug
    const news = await WrestlingNews.findOne({ slug: req.params.slug });

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

    const updatedWrestlingNews = await WrestlingNews.findOneAndUpdate(
      { slug: req.params.slug },
      updates,
      { new: true }
    );

    res.json(updatedWrestlingNews);
  } catch (error) {
    console.error("Error updating news by slug:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete news
exports.deleteWrestlingNews = async (req, res) => {
  try {
    const news = await WrestlingNews.findById(req.params.id);
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
