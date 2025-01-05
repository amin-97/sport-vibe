// server/models/Teams.js
const mongoose = require("mongoose");

const teamsSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    full_name: {
      type: String,
      required: true,
    },
    abbreviation: {
      type: String,
      required: true,
      uppercase: true,
      minlength: 2,
      maxlength: 3,
    },
    nickname: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    year_founded: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear(),
    },
    conference: {
      type: String,
      enum: ["Eastern", "Western"],
    },
    division: {
      type: String,
      enum: [
        "Atlantic",
        "Central",
        "Southeast",
        "Northwest",
        "Pacific",
        "Southwest",
      ],
    },
    logo: {
      type: String,
      default: null,
    },
    primaryColor: {
      type: String,
    },
    secondaryColor: {
      type: String,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    indexes: [
      { abbreviation: 1 },
      { full_name: 1 },
      { city: 1 },
      { state: 1 },
      { year_founded: 1 },
    ],
  }
);

// Validate abbreviation is uppercase
teamsSchema.pre("save", function (next) {
  if (this.abbreviation) {
    this.abbreviation = this.abbreviation.toUpperCase();
  }
  next();
});

// Optional: method to get team details
teamsSchema.methods.getTeamInfo = function () {
  return {
    name: this.full_name,
    location: `${this.city}, ${this.state}`,
    founded: this.year_founded,
  };
};

// Optional: static method to find team by different identifiers
teamsSchema.statics.findByIdentifier = async function (identifier) {
  return this.findOne({
    $or: [
      { id: identifier },
      { abbreviation: identifier },
      { full_name: identifier },
      { nickname: identifier },
    ],
  });
};

module.exports = mongoose.model("Teams", teamsSchema);
