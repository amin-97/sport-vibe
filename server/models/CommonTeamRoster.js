// server/models/CommonTeamRoster.js
const mongoose = require("mongoose");

const commonTeamRosterSchema = new mongoose.Schema(
  {
    TeamID: {
      type: String,
      required: true,
      index: true,
    },
    SEASON: {
      type: String,
      required: true,
      index: true,
    },
    LeagueID: {
      type: String,
      required: true,
      default: "00",
    },
    PLAYER: {
      type: String,
      required: true,
    },
    NICKNAME: {
      type: String,
      required: true,
    },
    PLAYER_SLUG: {
      type: String,
      required: true,
      lowercase: true,
    },
    NUM: {
      type: String,
      required: true,
    },
    POSITION: {
      type: String,
      required: true,
      enum: ["G", "F", "C", "G-F", "F-C", "F-G"],
    },
    HEIGHT: {
      type: String,
      required: true,
    },
    WEIGHT: {
      type: Number,
      required: true,
    },
    BIRTH_DATE: {
      type: String,
      required: true,
    },
    AGE: {
      type: Number,
      required: true,
      min: 18,
      max: 45,
    },
    EXP: {
      type: Number,
      required: true,
      min: 0,
    },
    SCHOOL: {
      type: String,
      default: null,
    },
    PLAYER_ID: {
      type: String,
      required: true,
      unique: true,
    },
    HOW_ACQUIRED: {
      type: String,
      required: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    indexes: [
      { TeamID: 1, SEASON: 1 }, // Composite index for team and season
      { PLAYER: 1 },
      { PLAYER_ID: 1 },
      { POSITION: 1 },
    ],
  }
);

// Virtual for full player information
commonTeamRosterSchema.virtual("playerInfo").get(function () {
  return {
    fullName: this.PLAYER,
    number: this.NUM,
    position: this.POSITION,
    height: this.HEIGHT,
    experience: this.EXP,
  };
});

// Static method to find players by various identifiers
commonTeamRosterSchema.statics.findPlayer = async function (
  identifier,
  season
) {
  const query = {
    $or: [
      { PLAYER: new RegExp(identifier, "i") },
      { PLAYER_ID: identifier },
      { PLAYER_SLUG: identifier.toLowerCase() },
    ],
  };

  if (season) {
    query.SEASON = season;
  }

  return this.find(query);
};

// Method to calculate player's current status
commonTeamRosterSchema.methods.getPlayerStatus = function () {
  const rookieYears = ["R", "Rookie"];
  return {
    isRookie: rookieYears.includes(this.EXP),
    experience: this.EXP,
    position: this.POSITION,
  };
};

module.exports = mongoose.model("CommonTeamRoster", commonTeamRosterSchema);
