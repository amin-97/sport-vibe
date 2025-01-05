// server/models/NBAPlayerStats.js
const mongoose = require("mongoose");

const playerCareerStatsSchema = new mongoose.Schema(
  {
    PLAYER_ID: {
      type: Number,
      required: true,
      index: true,
    },
    PLAYER_FIRST_NAME: {
      type: String,
      required: true,
    },
    PLAYER_LAST_NAME: {
      type: String,
      required: true,
    },
    DISPLAY_FIRST_LAST: {
      type: String,
      required: true,
    },
    SEASON_ID: {
      type: String,
      required: true,
    },
    LEAGUE_ID: {
      type: Number,
      required: true,
    },
    TEAM_ID: {
      type: Number,
      required: true,
    },
    TEAM_ABBREVIATION: {
      type: String,
      required: true,
    },
    PLAYER_AGE: {
      type: Number,
      required: true,
    },
    GP: {
      type: Number,
      required: true,
      default: 0,
    },
    GS: {
      type: Number,
      required: true,
      default: 0,
    },
    MIN: {
      type: Number,
      required: true,
      default: 0,
    },
    FGM: {
      type: Number,
      required: true,
      default: 0,
    },
    FGA: {
      type: Number,
      required: true,
      default: 0,
    },
    FG_PCT: {
      type: Number,
      required: true,
      default: 0,
    },
    FG3M: {
      type: Number,
      required: true,
      default: 0,
    },
    FG3A: {
      type: Number,
      required: true,
      default: 0,
    },
    FG3_PCT: {
      type: Number,
      required: true,
      default: 0,
    },
    FTM: {
      type: Number,
      required: true,
      default: 0,
    },
    FTA: {
      type: Number,
      required: true,
      default: 0,
    },
    FT_PCT: {
      type: Number,
      required: true,
      default: 0,
    },
    OREB: {
      type: Number,
      required: true,
      default: 0,
    },
    DREB: {
      type: Number,
      required: true,
      default: 0,
    },
    REB: {
      type: Number,
      required: true,
      default: 0,
    },
    AST: {
      type: Number,
      required: true,
      default: 0,
    },
    STL: {
      type: Number,
      required: true,
      default: 0,
    },
    BLK: {
      type: Number,
      required: true,
      default: 0,
    },
    TOV: {
      type: Number,
      required: true,
      default: 0,
    },
    PF: {
      type: Number,
      required: true,
      default: 0,
    },
    PTS: {
      type: Number,
      required: true,
      default: 0,
    },
    // Additional metadata fields
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    dataSource: {
      type: String,
      enum: ["nba_api", "manual_entry", "import"],
      default: "nba_api",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "retired"],
      default: "active",
    },
  },
  {
    timestamps: true,
    indexes: [
      { PLAYER_ID: 1, SEASON_ID: 1 }, // Composite index for player seasons
      { TEAM_ABBREVIATION: 1 }, // Index for team queries
      { SEASON_ID: 1 }, // Index for season queries
    ],
  }
);

// Add compound unique constraint
playerCareerStatsSchema.index(
  { PLAYER_ID: 1, SEASON_ID: 1, TEAM_ID: 1 },
  { unique: true }
);

// Virtual for player full name
playerCareerStatsSchema.virtual("fullName").get(function () {
  return `${this.PLAYER_FIRST_NAME} ${this.PLAYER_LAST_NAME}`;
});

// Method to calculate advanced stats
playerCareerStatsSchema.methods.calculateAdvancedStats = function () {
  return {
    trueShootingPct: this.PTS / (2 * (this.FGA + 0.44 * this.FTA)) || 0,
    effectiveFGPct: (this.FGM + 0.5 * this.FG3M) / this.FGA || 0,
    turnoverRatio: this.TOV / (this.FGA + 0.44 * this.FTA + this.TOV) || 0,
    assistRatio: this.AST / this.MIN || 0,
  };
};

// Pre-save middleware to update lastUpdated
playerCareerStatsSchema.pre("save", function (next) {
  this.lastUpdated = new Date();
  next();
});

// Static method to find player's career averages
playerCareerStatsSchema.statics.getCareerAverages = async function (playerId) {
  const stats = await this.aggregate([
    { $match: { PLAYER_ID: playerId } },
    {
      $group: {
        _id: "$PLAYER_ID",
        totalGames: { $sum: "$GP" },
        avgPoints: { $avg: "$PTS" },
        avgRebounds: { $avg: "$REB" },
        avgAssists: { $avg: "$AST" },
        avgBlocks: { $avg: "$BLK" },
        avgSteals: { $avg: "$STL" },
        avgMinutes: { $avg: "$MIN" },
        seasons: { $addToSet: "$SEASON_ID" },
      },
    },
  ]);
  return stats[0];
};

// Static method to find season leaders
playerCareerStatsSchema.statics.getSeasonLeaders = async function (
  seasonId,
  category,
  limit = 10
) {
  return this.find({ SEASON_ID: seasonId })
    .sort({ [category]: -1 })
    .limit(limit)
    .select(`PLAYER_FIRST_NAME PLAYER_LAST_NAME TEAM_ABBREVIATION ${category}`);
};

module.exports = mongoose.model("PlayerCareerStats", playerCareerStatsSchema);
