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

// In your activePlayerCareerStats.js routes
// server/routes/api/activePlayerCareerStats.js

// Get unique players with pagination
// server/routes/api/activePlayerCareerStats.js

router.get("/players/unique", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const skip = (page - 1) * limit;

    // First get total count of unique players
    const totalCount = await ActivePlayerCareerStats.aggregate([
      {
        $group: {
          _id: "$PLAYER_ID",
        },
      },
      {
        $count: "total",
      },
    ]);

    // Then get paginated unique players with explicit type conversion
    const uniquePlayers = await ActivePlayerCareerStats.aggregate([
      // Sort by latest season first for each player
      { $sort: { SEASON_ID: -1 } },
      // Group by PLAYER_ID
      {
        $group: {
          _id: { $toInt: "$PLAYER_ID" }, // Convert to integer
          latestDoc: { $first: "$$ROOT" }, // Get the most recent document
        },
      },
      // Restore the document structure
      {
        $replaceRoot: { newRoot: "$latestDoc" },
      },
      // Sort by name
      {
        $sort: { DISPLAY_FIRST_LAST: 1 },
      },
      // Pagination
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      // Project only needed fields
      {
        $project: {
          _id: 1,
          PLAYER_ID: { $toInt: "$PLAYER_ID" }, // Ensure integer type
          PLAYER_FIRST_NAME: 1,
          PLAYER_LAST_NAME: 1,
          DISPLAY_FIRST_LAST: 1,
          TEAM_ABBREVIATION: 1,
          PLAYER_AGE: 1,
          SEASON_ID: 1,
        },
      },
    ]);

    const total = totalCount[0]?.total || 0;

    res.json({
      stats: uniquePlayers,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalRecords: total,
    });
  } catch (error) {
    console.error("Error in /players/unique:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get player stats by name
router.get("/players/:playerName", async (req, res) => {
  try {
    // Decode and convert URL-friendly name to search-friendly format
    const playerName = decodeURIComponent(req.params.playerName)
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    //console.log("Searching for player name:", playerName);

    // Use more flexible search strategies
    const playerStats = await ActivePlayerCareerStats.find({
      $or: [
        {
          DISPLAY_FIRST_LAST: new RegExp(playerName.replace(/\s+/g, ".*"), "i"),
        },
        {
          $and: [
            { PLAYER_FIRST_NAME: new RegExp(playerName.split(" ")[0], "i") },
            {
              PLAYER_LAST_NAME: new RegExp(
                playerName.split(" ").slice(1).join(" "),
                "i"
              ),
            },
          ],
        },
      ],
    }).sort({ SEASON_ID: 1 });

    if (!playerStats.length) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.json({
      seasonStats: playerStats,
      careerStats: calculateCareerStats(playerStats),
    });
  } catch (error) {
    console.error("Error fetching player stats:", error);
    res.status(500).json({ message: error.message, stack: error.stack });
  }
});

// In your routes file (activePlayerCareerStats.js)
router.get("/players/name/:playerName", async (req, res) => {
  try {
    // Decode and convert URL-friendly name to search-friendly format
    const playerName = decodeURIComponent(req.params.playerName)
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    //console.log("Searching for player name:", //playerName);

    // Find the player(s) matching the name
    const players = await ActivePlayerCareerStats.find({
      $or: [
        {
          DISPLAY_FIRST_LAST: new RegExp(playerName.replace(/\s+/g, ".*"), "i"),
        },
        {
          $and: [
            { PLAYER_FIRST_NAME: new RegExp(playerName.split(" ")[0], "i") },
            {
              PLAYER_LAST_NAME: new RegExp(
                playerName.split(" ").slice(1).join(" "),
                "i"
              ),
            },
          ],
        },
      ],
    }).sort({ SEASON_ID: 1 });

    if (!players.length) {
      return res.status(404).json({ message: "Player not found" });
    }

    // Group stats by player
    const playerStatsMap = players.reduce((acc, player) => {
      if (!acc[player.PLAYER_ID]) {
        acc[player.PLAYER_ID] = {
          playerInfo: {
            PLAYER_ID: player.PLAYER_ID,
            DISPLAY_FIRST_LAST: player.DISPLAY_FIRST_LAST,
            TEAM_ABBREVIATION: player.TEAM_ABBREVIATION,
          },
          seasonStats: [],
        };
      }
      acc[player.PLAYER_ID].seasonStats.push(player);
      return acc;
    }, {});

    const playersData = Object.values(playerStatsMap).map((playerData) => ({
      ...playerData,
      careerStats: calculateCareerStats(playerData.seasonStats),
    }));

    res.json(playersData.length === 1 ? playersData[0] : playersData);
  } catch (error) {
    console.error("Error fetching player stats:", error);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
});

// Helper function to calculate career stats
const calculateCareerStats = (seasons) => {
  const totalGames = seasons.reduce((sum, season) => sum + season.GP, 0);

  return {
    totalGames,
    ppg:
      seasons.reduce((sum, season) => sum + season.PTS * season.GP, 0) /
      totalGames,
    rpg:
      seasons.reduce((sum, season) => sum + season.REB * season.GP, 0) /
      totalGames,
    apg:
      seasons.reduce((sum, season) => sum + season.AST * season.GP, 0) /
      totalGames,
    // Add more career stats as needed
  };
};

module.exports = router;
