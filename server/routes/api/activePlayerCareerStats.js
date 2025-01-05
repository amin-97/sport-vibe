// server/routes/api/activePlayerCareerStats.js
const express = require("express");
const router = express.Router();
const ActivePlayerCareerStats = require("../../models/ActivePlayerCareerStats");
const { verifyToken, isAdmin } = require("../../middleware/auth");
const validation = require("../../middleware/activePlayerCareerStatsValidation");
// GET /api/stats/players
// Get all players' career stats with pagination
router.get("/players", validation.getPlayersList, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const sort = req.query.sort || "-SEASON_ID";
    const filter = {};

    // Apply filters if provided
    if (req.query.team) {
      filter.TEAM_ABBREVIATION = req.query.team;
    }
    if (req.query.season) {
      filter.SEASON_ID = req.query.season;
    }

    const stats = await ActivePlayerCareerStats.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await ActivePlayerCareerStats.countDocuments(filter);

    res.json({
      stats,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalRecords: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/stats/players/:playerId
// Get specific player's career stats
router.get("/players/:playerId", async (req, res) => {
  try {
    const stats = await ActivePlayerCareerStats.find({
      PLAYER_ID: req.params.playerId,
    }).sort("-SEASON_ID");

    if (!stats.length) {
      return res.status(404).json({ message: "Player stats not found" });
    }

    const careerAverages = await ActivePlayerCareerStats.getCareerAverages(
      req.params.playerId
    );

    res.json({
      seasonStats: stats,
      careerAverages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/stats/leaders
// Get statistical leaders
router.get("/leaders", async (req, res) => {
  try {
    const { season, category = "PTS", limit = 10 } = req.query;

    if (!season) {
      return res.status(400).json({ message: "Season parameter is required" });
    }

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
      return res.status(400).json({ message: "Invalid category" });
    }

    const leaders = await ActivePlayerCareerStats.getSeasonLeaders(
      season,
      category,
      limit
    );
    res.json(leaders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Protected routes using verifyToken and isAdmin middleware
// POST /api/stats/players (Admin only)
router.post("/players", verifyToken, isAdmin, async (req, res) => {
  try {
    const newStats = new ActivePlayerCareerStats(req.body);
    await newStats.save();
    res.status(201).json(newStats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/stats/players/:playerId/:seasonId (Admin only)
router.put(
  "/players/:playerId/:seasonId",
  verifyToken,
  isAdmin,
  async (req, res) => {
    try {
      const stats = await ActivePlayerCareerStats.findOneAndUpdate(
        {
          PLAYER_ID: req.params.playerId,
          SEASON_ID: req.params.seasonId,
        },
        req.body,
        { new: true, runValidators: true }
      );

      if (!stats) {
        return res.status(404).json({ message: "Stats not found" });
      }

      res.json(stats);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// DELETE /api/stats/players/:playerId/:seasonId (Admin only)
router.delete(
  "/players/:playerId/:seasonId",
  verifyToken,
  isAdmin,
  async (req, res) => {
    try {
      const stats = await ActivePlayerCareerStats.findOneAndDelete({
        PLAYER_ID: req.params.playerId,
        SEASON_ID: req.params.seasonId,
      });

      if (!stats) {
        return res.status(404).json({ message: "Stats not found" });
      }

      res.json({ message: "Stats deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// GET /api/stats/search
// Search players
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const stats = await ActivePlayerCareerStats.find({
      $or: [
        { PLAYER_FIRST_NAME: new RegExp(query, "i") },
        { PLAYER_LAST_NAME: new RegExp(query, "i") },
        { DISPLAY_FIRST_LAST: new RegExp(query, "i") },
      ],
    })
      .sort("-SEASON_ID")
      .limit(10);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/stats/teams/:teamAbbr
// Get team roster stats
router.get("/teams/:teamAbbr", async (req, res) => {
  try {
    const { season } = req.query;
    const filter = {
      TEAM_ABBREVIATION: req.params.teamAbbr.toUpperCase(),
    };

    if (season) {
      filter.SEASON_ID = season;
    }

    const stats = await ActivePlayerCareerStats.find(filter).sort("-PTS");

    if (!stats.length) {
      return res.status(404).json({ message: "Team stats not found" });
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/stats/advanced/:playerId
// Get advanced stats for a player
router.get("/advanced/:playerId", async (req, res) => {
  try {
    const stats = await ActivePlayerCareerStats.findOne({
      PLAYER_ID: req.params.playerId,
    }).sort("-SEASON_ID");

    if (!stats) {
      return res.status(404).json({ message: "Player stats not found" });
    }

    const advancedStats = stats.calculateAdvancedStats();
    res.json(advancedStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
