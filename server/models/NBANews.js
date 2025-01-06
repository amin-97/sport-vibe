// server/models/NBANews.js
const mongoose = require("mongoose");

const nbaNewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return this.status === "draft" ? v.length >= 1 : v.length >= 5;
        },
        message: (props) =>
          props.value.length < 1
            ? "Title is required"
            : "Title must be at least 5 characters for published content",
      },
    },
    description: {
      type: String,
      required: function () {
        return this.status === "published";
      },
    },
    content: {
      type: String,
      required: function () {
        return this.status === "published";
      },
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
      default: "draft",
    },
    category: {
      type: String,
      enum: ["news", "trades", "rumors", "injuries", "game-recap", "analysis"],
      required: function () {
        return this.status === "published";
      },
    },
    teams: [
      {
        type: String,
      },
    ],
    players: [
      {
        type: String,
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

// Add indexes for better query performance
nbaNewsSchema.index({ status: 1, createdAt: -1 });
nbaNewsSchema.index({ category: 1, status: 1 });
nbaNewsSchema.index({ slug: 1 }, { unique: true });
nbaNewsSchema.index({ author: 1, status: 1 });
nbaNewsSchema.index({ teams: 1 });
nbaNewsSchema.index({ players: 1 });
nbaNewsSchema.index({ featured: 1, status: 1 });

module.exports = mongoose.model("NBANews", nbaNewsSchema);
