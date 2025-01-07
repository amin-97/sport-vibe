// server/controllers/newsController.js
const WrestlingNews = require("../models/WrestlingNews");
const NBANews = require("../models/NBANews");
const { uploadToS3, deleteFromS3 } = require("../utils/s3");

class NewsController {
  constructor(model, type) {
    this.model = model;
    this.type = type;
    this.uploadFolder = `${type}-news`;

    // Bind all methods to the instance
    this.getAllNews = this.getAllNews.bind(this);
    this.getNewsBySlug = this.getNewsBySlug.bind(this);
    this.getNewsByCategory = this.getNewsByCategory.bind(this);
    this.createNews = this.createNews.bind(this);
    this.updateNewsBySlug = this.updateNewsBySlug.bind(this);
    this.deleteNews = this.deleteNews.bind(this);
    this.getDrafts = this.getDrafts.bind(this);
  }

  async getAllNews(req, res) {
    try {
      const news = await this.model
        .find({ status: "published" })
        .populate("author", "displayName")
        .sort({ createdAt: -1 });
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getNewsBySlug(req, res) {
    try {
      const query = { slug: req.params.slug };
      if (!req.user?.isAdmin) {
        query.status = "published";
      }

      const news = await this.model
        .findOne(query)
        .populate("author", "displayName");

      if (!news) {
        return res.status(404).json({ message: "News not found" });
      }
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getNewsByCategory(req, res) {
    try {
      const news = await this.model
        .find({
          category: req.params.category,
          status: "published",
        })
        .populate("author", "displayName")
        .sort({ createdAt: -1 });
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createNews(req, res) {
    try {
      const {
        title,
        category,
        description = "",
        content = "",
        tags,
        teams,
        players,
        status = "draft",
        featured,
      } = req.body;

      const newsData = {
        title,
        category,
        description,
        content,
        tags: tags ? JSON.parse(tags) : [],
        status,
        author: req.user._id,
      };

      if (this.type === "nba") {
        newsData.teams = teams ? JSON.parse(teams) : [];
        newsData.players = players ? JSON.parse(players) : [];
        newsData.featured = featured === "true";
      }

      if (req.file) {
        const uploadResult = await uploadToS3(req.file, this.uploadFolder);
        newsData.image = {
          url: uploadResult.url,
          key: uploadResult.key,
        };
      }

      const news = await this.model.create(newsData);
      res.status(201).json(news);
    } catch (error) {
      console.error("Error creating news:", error);
      res.status(500).json({ message: error.message });
    }
  }

  async updateNewsBySlug(req, res) {
    try {
      const news = await this.model.findOne({ slug: req.params.slug });
      if (!news) {
        return res.status(404).json({ message: "News not found" });
      }

      if (news.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const updates = {
        ...req.body,
        tags: req.body.tags ? JSON.parse(req.body.tags) : news.tags,
      };

      if (this.type === "nba") {
        updates.teams = req.body.teams
          ? JSON.parse(req.body.teams)
          : news.teams;
        updates.players = req.body.players
          ? JSON.parse(req.body.players)
          : news.players;
        updates.featured = req.body.featured === "true";
      }

      if (req.file) {
        if (news.image?.key) {
          await deleteFromS3(news.image.key);
        }

        const uploadResult = await uploadToS3(req.file, this.uploadFolder);
        updates.image = {
          url: uploadResult.url,
          key: uploadResult.key,
        };
      }

      const updatedNews = await this.model.findOneAndUpdate(
        { slug: req.params.slug },
        updates,
        { new: true }
      );

      res.json(updatedNews);
    } catch (error) {
      console.error("Error updating news:", error);
      res.status(500).json({ message: error.message });
    }
  }

  async deleteNews(req, res) {
    try {
      const news = await this.model.findOne({ slug: req.params.slug });
      if (!news) {
        return res.status(404).json({ message: "News not found" });
      }

      if (news.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }

      if (news.image?.key) {
        await deleteFromS3(news.image.key);
      }

      await news.deleteOne();
      res.json({ message: "News deleted successfully" });
    } catch (error) {
      console.error("Error deleting news:", error);
      if (error.name === "CastError" && error.kind === "ObjectId") {
        res.status(404).json({ message: "News not found" });
      } else {
        res.status(500).json({ message: "Error deleting news" });
      }
    }
  }

  // async deleteNews(req, res) {
  //   try {
  //     const news = await this.model.findOne({ slug: req.params.slug });
  //     if (!news) {
  //       return res.status(404).json({ message: "News not found" });
  //     }

  //     if (news.author.toString() !== req.user._id.toString()) {
  //       return res.status(403).json({ message: "Not authorized" });
  //     }

  //     if (news.image?.key) {
  //       await deleteFromS3(news.image.key);
  //     }

  //     await news.deleteOne(); // Changed from remove() to deleteOne()
  //     res.json({ message: "News deleted successfully" });
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // }

  async getDrafts(req, res) {
    try {
      const drafts = await this.model
        .find({
          status: "draft",
          author: req.user._id,
        })
        .populate("author", "displayName")
        .sort({ updatedAt: -1 });
      res.json(drafts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

// Create instances for each sport
const wrestlingNewsController = new NewsController(WrestlingNews, "wrestling");
const nbaNewsController = new NewsController(NBANews, "nba");

// Test that controllers were created properly
// console.log("Controllers initialized:", {
//   wrestlingNews: {
//     type: wrestlingNewsController.type,
//     methodsAvailable: Object.keys(wrestlingNewsController),
//   },
//   nbaNews: {
//     type: nbaNewsController.type,
//     methodsAvailable: Object.keys(nbaNewsController),
//   },
// });

module.exports = {
  wrestlingNewsController,
  nbaNewsController,
};
