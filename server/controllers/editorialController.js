// server/controllers/editorialController.js
const WrestlingEditorial = require("../models/WrestlingEditorial");
const NBAEditorial = require("../models/NBAEditorial");
const { uploadToS3, deleteFromS3 } = require("../utils/s3");

class EditorialController {
  constructor(model, type) {
    this.model = model;
    this.type = type;
    this.uploadFolder = `${type}-editorials`;

    // Bind all methods to this instance
    this.getAllEditorials = this.getAllEditorials.bind(this);
    this.getEditorialBySlug = this.getEditorialBySlug.bind(this);
    this.createEditorial = this.createEditorial.bind(this);
    this.updateEditorialBySlug = this.updateEditorialBySlug.bind(this);
    this.deleteEditorial = this.deleteEditorial.bind(this);
    this.getDrafts = this.getDrafts.bind(this);
  }

  async getAllEditorials(req, res) {
    try {
      const editorials = await this.model
        .find({ status: "published" })
        .populate("author", "displayName")
        .sort({ createdAt: -1 });
      res.json(editorials);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getEditorialBySlug(req, res) {
    try {
      const query = { slug: req.params.slug };
      if (!req.user?.isAdmin) {
        query.status = "published";
      }

      const editorial = await this.model
        .findOne(query)
        .populate("author", "displayName");

      if (!editorial) {
        return res.status(404).json({ message: "Editorial not found" });
      }
      res.json(editorial);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createEditorial(req, res) {
    try {
      const {
        title,
        category,
        summary,
        content,
        keyArguments,
        topics,
        teams,
        players,
        status = "draft",
      } = req.body;

      const editorialData = {
        title,
        summary,
        content,
        keyArguments: keyArguments ? JSON.parse(keyArguments) : [],
        topics: topics ? JSON.parse(topics) : [],
        status,
        author: req.user._id,
      };

      if (this.type === "nba") {
        editorialData.teams = teams ? JSON.parse(teams) : [];
        editorialData.players = players ? JSON.parse(players) : [];
      } else if (this.type === "wrestling") {
        editorialData.category = category;
      }

      if (req.file) {
        const uploadResult = await uploadToS3(req.file, this.uploadFolder);
        editorialData.image = {
          url: uploadResult.url,
          publicId: uploadResult.key,
        };
      }

      const editorial = await this.model.create(editorialData);
      res.status(201).json(editorial);
    } catch (error) {
      console.error("Error creating editorial:", error);
      res.status(500).json({ message: error.message });
    }
  }

  async updateEditorialBySlug(req, res) {
    try {
      const editorial = await this.model.findOne({ slug: req.params.slug });
      if (!editorial) {
        return res.status(404).json({ message: "Editorial not found" });
      }

      if (editorial.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const updates = {
        ...req.body,
        keyArguments: req.body.keyArguments
          ? JSON.parse(req.body.keyArguments)
          : editorial.keyArguments,
        topics: req.body.topics
          ? JSON.parse(req.body.topics)
          : editorial.topics,
      };

      if (this.type === "nba") {
        updates.teams = req.body.teams
          ? JSON.parse(req.body.teams)
          : editorial.teams;
        updates.players = req.body.players
          ? JSON.parse(req.body.players)
          : editorial.players;
      }

      if (req.file) {
        if (editorial.image?.publicId) {
          await deleteFromS3(editorial.image.publicId);
        }
        const uploadResult = await uploadToS3(req.file, this.uploadFolder);
        updates.image = {
          url: uploadResult.url,
          publicId: uploadResult.key,
        };
      }

      const updatedEditorial = await this.model.findOneAndUpdate(
        { slug: req.params.slug },
        updates,
        { new: true }
      );

      res.json(updatedEditorial);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteEditorial(req, res) {
    try {
      const editorial = await this.model.findOne({ slug: req.params.slug });
      if (!editorial) {
        return res.status(404).json({ message: "Editorial not found" });
      }

      if (editorial.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }

      if (editorial.image?.publicId) {
        await deleteFromS3(editorial.image.publicId);
      }

      await editorial.deleteOne();
      res.json({ message: "Editorial deleted successfully" });
    } catch (error) {
      console.error("Error deleting editorial:", error);
      res.status(500).json({ message: error.message });
    }
  }

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
const wrestlingEditorialController = new EditorialController(
  WrestlingEditorial,
  "wrestling"
);
const nbaEditorialController = new EditorialController(NBAEditorial, "nba");

module.exports = {
  wrestlingEditorialController,
  nbaEditorialController,
};
