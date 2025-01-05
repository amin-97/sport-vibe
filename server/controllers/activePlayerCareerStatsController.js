// server/controllers/activePlayerCareerStatsController.js
const ActivePlayerCareerStats = require("../models/ActivePlayerCareerStats");

// Controller methods for player stats
const activePlayerCareerStatsController = {
  // Get all players with pagination
  getAllPlayers: async (
    filter = {},
    page = 1,
    limit = 50,
    sort = "-SEASON_ID"
  ) => {
    const stats = await ActivePlayerCareerStats.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await ActivePlayerCareerStats.countDocuments(filter);

    return {
      stats,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalRecords: total,
    };
  },

  // Get specific player's stats
  getPlayerStats: async (playerId) => {
    const stats = await ActivePlayerCareerStats.find({
      PLAYER_ID: playerId,
    }).sort("-SEASON_ID");

    if (!stats.length) {
      throw new Error("Player stats not found");
    }

    const careerAverages = await ActivePlayerCareerStats.getCareerAverages(
      playerId
    );

    return {
      seasonStats: stats,
      careerAverages,
    };
  },

  // Get statistical leaders
  getLeaders: async (season, category = "PTS", limit = 10) => {
    const validCategories = [
      "PTS",
      "AST",
      "REB",
      "STL",
      "BLK",
      "FG_PCT",
      "FG3_PCT",
      "FT_PCT",
    ];
    if (!validCategories.includes(category)) {
      throw new Error("Invalid category");
    }

    return await ActivePlayerCareerStats.getSeasonLeaders(
      season,
      category,
      limit
    );
  },

  // Add new player stats
  addPlayerStats: async (statsData) => {
    const newStats = new ActivePlayerCareerStats(statsData);
    return await newStats.save();
  },

  // Update player stats
  updatePlayerStats: async (playerId, seasonId, statsData) => {
    const stats = await ActivePlayerCareerStats.findOneAndUpdate(
      {
        PLAYER_ID: playerId,
        SEASON_ID: seasonId,
      },
      statsData,
      { new: true, runValidators: true }
    );

    if (!stats) {
      throw new Error("Stats not found");
    }

    return stats;
  },

  // Delete player stats
  deletePlayerStats: async (playerId, seasonId) => {
    const stats = await ActivePlayerCareerStats.findOneAndDelete({
      PLAYER_ID: playerId,
      SEASON_ID: seasonId,
    });

    if (!stats) {
      throw new Error("Stats not found");
    }

    return { message: "Stats deleted successfully" };
  },

  // Search players
  searchPlayers: async (query, limit = 10) => {
    return await ActivePlayerCareerStats.find({
      $or: [
        { PLAYER_FIRST_NAME: new RegExp(query, "i") },
        { PLAYER_LAST_NAME: new RegExp(query, "i") },
        { DISPLAY_FIRST_LAST: new RegExp(query, "i") },
      ],
    })
      .sort("-SEASON_ID")
      .limit(limit);
  },

  // Get team roster stats
  getTeamStats: async (teamAbbr, season = null) => {
    const filter = {
      TEAM_ABBREVIATION: teamAbbr.toUpperCase(),
    };

    if (season) {
      filter.SEASON_ID = season;
    }

    const stats = await ActivePlayerCareerStats.find(filter).sort("-PTS");

    if (!stats.length) {
      throw new Error("Team stats not found");
    }

    return stats;
  },

  // Get advanced stats
  getAdvancedStats: async (playerId) => {
    const stats = await ActivePlayerCareerStats.findOne({
      PLAYER_ID: playerId,
    }).sort("-SEASON_ID");

    if (!stats) {
      throw new Error("Player stats not found");
    }

    return stats.calculateAdvancedStats();
  },

  // Bulk import stats
  bulkImportStats: async (statsArray) => {
    return await ActivePlayerCareerStats.insertMany(statsArray, {
      ordered: false,
      runValidators: true,
    });
  },

  // Get player comparison
  comparePlayersStats: async (playerIds) => {
    if (!Array.isArray(playerIds) || playerIds.length < 2) {
      throw new Error("At least two player IDs are required for comparison");
    }

    const comparisons = await Promise.all(
      playerIds.map(async (playerId) => {
        const stats = await ActivePlayerCareerStats.findOne({
          PLAYER_ID: playerId,
        }).sort("-SEASON_ID");
        return {
          player: stats.DISPLAY_FIRST_LAST,
          stats: stats,
          advancedStats: stats.calculateAdvancedStats(),
        };
      })
    );

    return comparisons;
  },
};

module.exports = activePlayerCareerStatsController;
