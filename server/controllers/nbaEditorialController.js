// server/controllers/nbaEditorialController.js
const NBAEditorial = require("../models/NBAEditorial");
const { uploadToS3, deleteFromS3 } = require("../utils/s3");

exports.getAllEditorials = async (req, res) => {
  try {
    const editorials = await NBAEditorial.find({ status: "published" })
      .populate("author", "displayName")
      .sort({ createdAt: -1 });
    res.json(editorials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEditorialBySlug = async (req, res) => {
  try {
    const editorial = await NBAEditorial.findOne({
      slug: req.params.slug,
      status: "published",
    }).populate("author", "displayName");

    if (!editorial) {
      return res.status(404).json({ message: "Editorial not found" });
    }
    res.json(editorial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFeaturedEditorials = async (req, res) => {
  try {
    const editorials = await NBAEditorial.find({
      featured: true,
      status: "published",
    })
      .populate("author", "displayName")
      .sort({ createdAt: -1 });
    res.json(editorials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createEditorial = async (req, res) => {
  try {
    const {
      title,
      summary,
      content,
      keyArguments,
      topics,
      teams,
      players,
      status,
      featured,
    } = req.body;

    // Calculate reading time
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);

    const editorialData = {
      title,
      summary,
      content,
      keyArguments: keyArguments ? JSON.parse(keyArguments) : [],
      topics: topics ? JSON.parse(topics) : [],
      teams: teams ? JSON.parse(teams) : [],
      players: players ? JSON.parse(players) : [],
      status: status || "published",
      featured: featured === "true",
      author: req.user._id,
      readingTime,
    };

    if (req.file) {
      const uploadResult = await uploadToS3(req.file, "nba-editorials");
      editorialData.image = {
        url: uploadResult.url,
        publicId: uploadResult.key,
      };
    }

    const editorial = await NBAEditorial.create(editorialData);
    res.status(201).json(editorial);
  } catch (error) {
    console.error("Error creating editorial:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateEditorial = async (req, res) => {
  try {
    const editorial = await NBAEditorial.findById(req.params.id);
    if (!editorial) {
      return res.status(404).json({ message: "Editorial not found" });
    }

    // Check if user is the author
    if (editorial.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updates = {
      ...req.body,
      keyArguments: req.body.keyArguments
        ? JSON.parse(req.body.keyArguments)
        : editorial.keyArguments,
      topics: req.body.topics ? JSON.parse(req.body.topics) : editorial.topics,
      teams: req.body.teams ? JSON.parse(req.body.teams) : editorial.teams,
      players: req.body.players
        ? JSON.parse(req.body.players)
        : editorial.players,
      featured: req.body.featured === "true",
    };

    // Recalculate reading time if content is updated
    if (updates.content) {
      const wordsPerMinute = 200;
      const wordCount = updates.content.split(/\s+/).length;
      updates.readingTime = Math.ceil(wordCount / wordsPerMinute);
    }

    if (req.file) {
      if (editorial.image?.publicId) {
        await deleteFromS3(editorial.image.publicId);
      }
      const uploadResult = await uploadToS3(req.file, "nba-editorials");
      updates.image = {
        url: uploadResult.url,
        publicId: uploadResult.key,
      };
    }

    const updatedEditorial = await NBAEditorial.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    res.json(updatedEditorial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEditorialBySlug = async (req, res) => {
  try {
    // Find the editorial by slug
    const editorial = await NBAEditorial.findOne({
      slug: req.params.slug,
    });

    if (!editorial) {
      return res.status(404).json({ message: "Editorial not found" });
    }

    // Check if user is the author
    if (editorial.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updates = {
      title: req.body.title,
      summary: req.body.summary,
      content: req.body.content,
      keyArguments: req.body.keyArguments
        ? JSON.parse(req.body.keyArguments)
        : editorial.keyArguments,
      topics: req.body.topics ? JSON.parse(req.body.topics) : editorial.topics,
      teams: req.body.teams ? JSON.parse(req.body.teams) : editorial.teams,
      players: req.body.players
        ? JSON.parse(req.body.players)
        : editorial.players,
      status: req.body.status || editorial.status,
      featured: req.body.featured === "true",
    };

    // Recalculate reading time if content is updated
    if (updates.content) {
      const wordsPerMinute = 200;
      const wordCount = updates.content.split(/\s+/).length;
      updates.readingTime = Math.ceil(wordCount / wordsPerMinute);
    }

    // Handle image update
    if (req.file) {
      // Delete old image if it exists
      if (editorial.image?.publicId) {
        await deleteFromS3(editorial.image.publicId);
      }

      const uploadResult = await uploadToS3(req.file, "nba-editorials");
      updates.image = {
        url: uploadResult.url,
        publicId: uploadResult.key,
      };
    }

    const updatedEditorial = await NBAEditorial.findOneAndUpdate(
      { slug: req.params.slug },
      updates,
      { new: true }
    );

    res.json(updatedEditorial);
  } catch (error) {
    console.error("Error updating editorial by slug:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEditorial = async (req, res) => {
  try {
    const editorial = await NBAEditorial.findById(req.params.id);
    if (!editorial) {
      return res.status(404).json({ message: "Editorial not found" });
    }

    // Check if user is the author
    if (editorial.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (editorial.image?.publicId) {
      await deleteFromS3(editorial.image.publicId);
    }

    await editorial.remove();
    res.json({ message: "Editorial deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllDrafts = async (req, res) => {
  try {
    const drafts = await NBAEditorial.find({
      status: "draft",
      author: req.user._id, // Ensure users can only see their own drafts
    })
      .populate("author", "displayName")
      .sort({ createdAt: -1 });
    res.json(drafts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;
