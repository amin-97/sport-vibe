// server/models/WrestlingResult.js
const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  wrestlers: [
    {
      type: String,
      required: true,
    },
  ],
  winner: {
    type: String,
    required: true,
  },
  duration: String,
  highlights: {
    type: String,
    required: true,
  },
  thoughts: {
    type: String,
    required: true,
  },
});

const wrestlingResultSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    promotion: {
      type: String,
      enum: ["WWE", "AEW"],
      required: true,
    },
    matches: [matchSchema],
    coverImage: {
      url: String,
      publicId: String, // For cloud storage reference
    },
    additionalImages: [
      {
        url: String,
        publicId: String,
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
  },
  {
    timestamps: true,
  }
);

// Create slug before saving
wrestlingResultSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .concat("-", Date.now().toString().slice(-4));
  }
  next();
});

module.exports = mongoose.model("WrestlingResult", wrestlingResultSchema);
