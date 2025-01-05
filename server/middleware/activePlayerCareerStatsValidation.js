// server/middleware/validation/playerStatsValidation.js
const { body, query, param, validationResult } = require("express-validator");

// Helper function to validate numeric fields
const isNumeric = (value) => {
  if (value === undefined || value === null) return true;
  return !isNaN(parseFloat(value)) && isFinite(value);
};

// Helper function to handle validation results
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const playerStatsValidation = {
  // GET /api/stats/players
  getPlayersList: [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    // Removed limit validation
    query("sort").optional().isString().withMessage("Sort must be a string"),
    query("team")
      .optional()
      .isString()
      .isLength({ min: 2, max: 3 })
      .withMessage("Team must be a valid abbreviation"),
    query("season")
      .optional()
      .isString()
      .matches(/^\d{4}-\d{2}$/)
      .withMessage("Season must be in format YYYY-YY"),
    validateRequest,
  ],

  // GET /api/stats/players/:playerId
  getPlayerStats: [
    param("playerId").isInt().withMessage("Player ID must be an integer"),
    validateRequest,
  ],

  // GET /api/stats/leaders
  getLeaders: [
    query("season")
      .notEmpty()
      .matches(/^\d{4}-\d{2}$/)
      .withMessage("Season must be in format YYYY-YY"),
    query("category")
      .optional()
      .isIn(["PTS", "AST", "REB", "STL", "BLK", "FG_PCT", "FG3_PCT", "FT_PCT"])
      .withMessage("Invalid category"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage("Limit must be between 1 and 50"),
    validateRequest,
  ],

  // POST /api/stats/players
  createPlayerStats: [
    body("PLAYER_ID")
      .notEmpty()
      .isInt()
      .withMessage("Player ID is required and must be an integer"),
    body("PLAYER_FIRST_NAME")
      .notEmpty()
      .isString()
      .trim()
      .withMessage("First name is required"),
    body("PLAYER_LAST_NAME")
      .notEmpty()
      .isString()
      .trim()
      .withMessage("Last name is required"),
    body("DISPLAY_FIRST_LAST")
      .notEmpty()
      .isString()
      .trim()
      .withMessage("Display name is required"),
    body("SEASON_ID")
      .notEmpty()
      .matches(/^\d{4}-\d{2}$/)
      .withMessage("Season must be in format YYYY-YY"),
    body("LEAGUE_ID").notEmpty().isInt().withMessage("League ID is required"),
    body("TEAM_ID").notEmpty().isInt().withMessage("Team ID is required"),
    body("TEAM_ABBREVIATION")
      .notEmpty()
      .isString()
      .isLength({ min: 2, max: 3 })
      .withMessage("Team abbreviation must be 2-3 characters"),
    body("PLAYER_AGE")
      .notEmpty()
      .isInt({ min: 18, max: 50 })
      .withMessage("Player age must be between 18 and 50"),

    // Game stats validation
    body(["GP", "GS"])
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage("Games must be non-negative"),
    body("MIN")
      .notEmpty()
      .isFloat({ min: 0 })
      .withMessage("Minutes must be non-negative"),

    // Shooting stats validation
    body(["FGM", "FGA", "FG3M", "FG3A", "FTM", "FTA"])
      .notEmpty()
      .custom(isNumeric)
      .isFloat({ min: 0 })
      .withMessage("Shot attempts/makes must be non-negative"),

    body(["FG_PCT", "FG3_PCT", "FT_PCT"])
      .notEmpty()
      .custom(isNumeric)
      .isFloat({ min: 0, max: 1 })
      .withMessage("Percentages must be between 0 and 1"),

    // Rebound stats validation
    body(["OREB", "DREB", "REB"])
      .notEmpty()
      .custom(isNumeric)
      .isFloat({ min: 0 })
      .withMessage("Rebounds must be non-negative"),

    // Other stats validation
    body(["AST", "STL", "BLK", "TOV", "PF", "PTS"])
      .notEmpty()
      .custom(isNumeric)
      .isFloat({ min: 0 })
      .withMessage("Stats must be non-negative"),

    // Custom validation for rebounds
    body().custom((value) => {
      if (value.OREB + value.DREB !== value.REB) {
        throw new Error(
          "Total rebounds must equal offensive plus defensive rebounds"
        );
      }
      return true;
    }),

    validateRequest,
  ],

  // PUT /api/stats/players/:playerId/:seasonId
  updatePlayerStats: [
    param("playerId").isInt().withMessage("Player ID must be an integer"),
    param("seasonId")
      .matches(/^\d{4}-\d{2}$/)
      .withMessage("Season must be in format YYYY-YY"),

    // Allow all fields to be optional for updates
    body("PLAYER_FIRST_NAME").optional().isString().trim(),
    body("PLAYER_LAST_NAME").optional().isString().trim(),
    body("TEAM_ABBREVIATION")
      .optional()
      .isString()
      .isLength({ min: 2, max: 3 }),
    body("PLAYER_AGE").optional().isInt({ min: 18, max: 50 }),

    // Game stats validation
    body(["GP", "GS"]).optional().isInt({ min: 0 }),
    body("MIN").optional().isFloat({ min: 0 }),

    // Shot stats validation
    body(["FGM", "FGA", "FG3M", "FG3A", "FTM", "FTA"])
      .optional()
      .custom(isNumeric)
      .isFloat({ min: 0 }),

    body(["FG_PCT", "FG3_PCT", "FT_PCT"])
      .optional()
      .custom(isNumeric)
      .isFloat({ min: 0, max: 1 }),

    // Other stats validation
    body(["OREB", "DREB", "REB", "AST", "STL", "BLK", "TOV", "PF", "PTS"])
      .optional()
      .custom(isNumeric)
      .isFloat({ min: 0 }),

    validateRequest,
  ],

  // DELETE /api/stats/players/:playerId/:seasonId
  deletePlayerStats: [
    param("playerId").isInt().withMessage("Player ID must be an integer"),
    param("seasonId")
      .matches(/^\d{4}-\d{2}$/)
      .withMessage("Season must be in format YYYY-YY"),
    validateRequest,
  ],

  // GET /api/stats/search
  searchPlayers: [
    query("query")
      .notEmpty()
      .isString()
      .trim()
      .withMessage("Search query is required"),
    validateRequest,
  ],

  // GET /api/stats/teams/:teamAbbr
  getTeamStats: [
    param("teamAbbr")
      .isString()
      .isLength({ min: 2, max: 3 })
      .withMessage("Team abbreviation must be 2-3 characters"),
    query("season")
      .optional()
      .matches(/^\d{4}-\d{2}$/)
      .withMessage("Season must be in format YYYY-YY"),
    validateRequest,
  ],

  // GET /api/stats/advanced/:playerId
  getAdvancedStats: [
    param("playerId").isInt().withMessage("Player ID must be an integer"),
    validateRequest,
  ],
};

module.exports = playerStatsValidation;
