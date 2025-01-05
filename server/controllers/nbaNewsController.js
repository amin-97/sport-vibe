// server/controllers/nbaNewsController.js
const NBANews = require("../models/NBANews");
const { uploadToS3, deleteFromS3 } = require("../utils/s3");

exports.getAllNews = async (req, res) => {
  try {
    const news = await NBANews.find({ status: "published" })
      .populate("author", "displayName")
      .sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNewsBySlug = async (req, res) => {
  try {
    const news = await NBANews.findOne({
      slug: req.params.slug,
      status: "published",
    }).populate("author", "displayName");

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNewsByCategory = async (req, res) => {
  try {
    const news = await NBANews.find({
      category: req.params.category,
      status: "published",
    })
      .populate("author", "displayName")
      .sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createNews = async (req, res) => {
  try {
    const {
      title,
      description,
      content,
      category,
      tags,
      teams,
      players,
      status,
      featured,
    } = req.body;

    const newsData = {
      title,
      description,
      content,
      category,
      tags: tags ? JSON.parse(tags) : [],
      teams: teams ? JSON.parse(teams) : [],
      players: players ? JSON.parse(players) : [],
      status: status || "published",
      featured: featured === "true",
      author: req.user._id,
    };

    if (req.file) {
      const uploadResult = await uploadToS3(req.file, "nba-articles");
      newsData.image = {
        url: uploadResult.url,
        publicId: uploadResult.key,
      };
    }

    const news = await NBANews.create(newsData);
    res.status(201).json(news);
  } catch (error) {
    console.error("Error creating news:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateNews = async (req, res) => {
  try {
    const news = await NBANews.findById(req.params.id);
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
      teams: req.body.teams ? JSON.parse(req.body.teams) : news.teams,
      players: req.body.players ? JSON.parse(req.body.players) : news.players,
      featured: req.body.featured === "true",
    };

    if (req.file) {
      if (news.image?.publicId) {
        await deleteFromS3(news.image.publicId);
      }
      const uploadResult = await uploadToS3(req.file, "nba-articles");
      updates.image = {
        url: uploadResult.url,
        publicId: uploadResult.key,
      };
    }

    const updatedNews = await NBANews.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    res.json(updatedNews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteNews = async (req, res) => {
  try {
    const news = await NBANews.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    if (news.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (news.image?.publicId) {
      await deleteFromS3(news.image.publicId);
    }

    await news.remove();
    res.json({ message: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateNewsBySlug = async (req, res) => {
  try {
    const news = await NBANews.findOne({ slug: req.params.slug });
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
      teams: req.body.teams ? JSON.parse(req.body.teams) : news.teams,
      players: req.body.players ? JSON.parse(req.body.players) : news.players,
      featured: req.body.featured === "true",
    };

    if (req.file) {
      if (news.image?.publicId) {
        await deleteFromS3(news.image.publicId);
      }
      const uploadResult = await uploadToS3(req.file, "nba-articles");
      updates.image = {
        url: uploadResult.url,
        publicId: uploadResult.key,
      };
    }

    const updatedNews = await NBANews.findOneAndUpdate(
      { slug: req.params.slug },
      updates,
      { new: true }
    );

    res.json(updatedNews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
