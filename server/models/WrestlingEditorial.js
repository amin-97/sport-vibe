// server/models/WrestlingEditorial.js
const mongoose = require("mongoose");

const wrestlingEditorialSchema = new mongoose.Schema(
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
    category: {
      type: String,
      enum: ["nba", "wrestling"],
      required: function () {
        return this.status === "published";
      },
    },
    summary: {
      type: String,
      required: function () {
        return this.status === "published";
      },
      maxLength: 1000,
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
    keyArguments: [
      {
        type: String,
        required: function () {
          return this.status === "published";
        },
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
      default: "draft",
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
      type: Number,
      required: function () {
        return this.status === "published";
      },
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
  if (this.isModified("content") && this.content) {
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
