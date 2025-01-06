// server/models/WrestlingNews.js
const mongoose = require("mongoose");

const wrestlingNewsSchema = new mongoose.Schema(
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
      enum: ["wwe", "aew"],
      required: function () {
        return this.status === "published";
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
      key: String,
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
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug before saving
wrestlingNewsSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug =
      this.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-") +
      "-" +
      Date.now().toString().slice(-4);
  }
  next();
});

// Add indexes for better query performance
wrestlingNewsSchema.index({ status: 1, createdAt: -1 });
wrestlingNewsSchema.index({ category: 1, status: 1 });
wrestlingNewsSchema.index({ slug: 1 }, { unique: true });
wrestlingNewsSchema.index({ author: 1, status: 1 });

module.exports = mongoose.model("WrestlingNews", wrestlingNewsSchema);
