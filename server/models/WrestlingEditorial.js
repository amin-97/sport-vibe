// server/models/Editorial.js
const mongoose = require("mongoose");

const wrestlingEditorialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["nba", "wrestling"],
      required: true,
    },
    summary: {
      type: String,
      required: true,
      maxLength: 1000,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      url: String,
      publicId: String,
    },
    keyArguments: [
      {
        type: String,
        required: true,
      },
    ],
    topics: [
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
    views: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    relatedContent: [
      {
        type: {
          type: String,
          enum: ["news", "editorial", "result"],
        },
        item: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "relatedContent.type",
        },
      },
    ],
    readingTime: {
      type: Number, // in minutes
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create slug before saving
wrestlingEditorialSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .concat("-", Date.now().toString().slice(-4));
  }

  // Calculate reading time if content is modified
  if (this.isModified("content")) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / wordsPerMinute);
  }

  next();
});

// Add indexes
wrestlingEditorialSchema.index({ category: 1, createdAt: -1 });
wrestlingEditorialSchema.index({ topics: 1 });
wrestlingEditorialSchema.index({ featured: 1 });
wrestlingEditorialSchema.index({ "relatedContent.item": 1 });

module.exports = mongoose.model("WrestlingEditorial", wrestlingEditorialSchema);
