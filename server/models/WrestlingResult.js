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
  thoughts: {
    type: String,
    required: true,
  },
  // New fields:
  stipulation: {
    type: String, // For special match rules like "No DQ", "Steel Cage", etc.
    default: "Regular Match",
  },
  matchOrder: {
    type: Number, // To track match position on card (opener, main event, etc.)
    required: true,
  },
  method: {
    type: String, // How the match ended: "Pinfall", "Submission", "DQ", etc.
    required: true,
    enum: [
      "Pinfall",
      "Submission",
      "DQ",
      "Count Out",
      "No Contest",
      "Draw",
      "Other",
    ],
  },
  title: {
    type: String, // If it was a title match, which title was on the line
    default: null,
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
      default: "draft",
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
