// server/models/NBAArticle.js
const mongoose = require("mongoose");

const nbaNewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      url: String,
      publicId: String,
    },
    tags: [
      {
        type: String,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
    category: {
      type: String,
      enum: [
        "news", // Breaking news, general updates
        "trades", // Trade news and analysis
        "rumors", // Trade rumors, free agency rumors
        "injuries", // Injury reports and updates
        "game-recap", // Game summaries and analysis
        "analysis", // Deep analysis of teams/players
      ],
      required: true,
    },
    teams: [
      {
        type: String, // NBA team names
      },
    ],
    players: [
      {
        type: String, // Player names
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create slug before saving
nbaNewsSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .concat("-", Date.now().toString().slice(-4));
  }
  next();
});

module.exports = mongoose.model("NBANews", nbaNewsSchema);
