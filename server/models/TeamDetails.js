// server/models/TeamDetails.js
const mongoose = require("mongoose");

const teamDetailsSchema = new mongoose.Schema(
  {
    TEAM_ID: {
      type: String,
      required: true,
      unique: true,
    },
    ABBREVIATION: {
      type: String,
      required: true,
      uppercase: true,
      minlength: 2,
      maxlength: 3,
    },
    NICKNAME: {
      type: String,
      required: true,
    },
    YEARFOUNDED: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear(),
    },
    CITY: {
      type: String,
      required: true,
    },
    ARENA: {
      type: String,
      required: true,
    },
    ARENACAPACITY: {
      type: Number,
      required: true,
      min: 0,
    },
    OWNER: {
      type: String,
      required: true,
    },
    GENERALMANAGER: {
      type: String,
      required: true,
    },
    HEADCOACH: {
      type: String,
      required: true,
    },
    DLEAGUEAFFILIATION: {
      type: String,
      default: null,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    indexes: [
      { ABBREVIATION: 1 },
      { NICKNAME: 1 },
      { CITY: 1 },
      { YEARFOUNDED: 1 },
    ],
  }
);

// Validate abbreviation is uppercase
teamDetailsSchema.pre("save", function (next) {
  if (this.ABBREVIATION) {
    this.ABBREVIATION = this.ABBREVIATION.toUpperCase();
  }
  next();
});

// Method to get team details
teamDetailsSchema.methods.getTeamInfo = function () {
  return {
    name: `${this.CITY} ${this.NICKNAME}`,
    arena: this.ARENA,
    founded: this.YEARFOUNDED,
  };
};

// Static method to find team by different identifiers
teamDetailsSchema.statics.findByIdentifier = async function (identifier) {
  return this.findOne({
    $or: [
      { TEAM_ID: identifier },
      { ABBREVIATION: identifier },
      { NICKNAME: identifier },
      { CITY: identifier },
    ],
  });
};

module.exports = mongoose.model("TeamDetails", teamDetailsSchema);
