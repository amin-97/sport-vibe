// server/middleware/validation/commonTeamRosterValidation.js
const { body, query, param, validationResult } = require("express-validator");

// Helper function to handle validation results
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const commonTeamRosterValidation = {
  // GET /api/team-roster
  getRosterList: [
    query("teamId")
      .optional()
      .isString()
      .withMessage("Team ID must be a valid string"),
    query("season")
      .optional()
      .isString()
      .withMessage("Season must be a valid string"),
    query("position")
      .optional()
      .isIn(["G", "F", "C", "G-F", "F-C", "F-G"])
      .withMessage("Invalid position"),
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage("Limit must be between 1 and 50"),
    validateRequest,
  ],

  // GET /api/team-roster/player/:identifier
  getPlayerByIdentifier: [
    param("identifier").notEmpty().withMessage("Player identifier is required"),
    query("season")
      .optional()
      .isString()
      .withMessage("Season must be a valid string"),
    validateRequest,
  ],

  // POST /api/team-roster (Admin only)
  createRosterEntry: [
    body("TeamID").notEmpty().isString().withMessage("Team ID is required"),
    body("SEASON").notEmpty().isString().withMessage("Season is required"),
    body("PLAYER").notEmpty().isString().withMessage("Player name is required"),
    body("PLAYER_ID")
      .notEmpty()
      .isString()
      .withMessage("Player ID is required"),
    body("NUM").notEmpty().isString().withMessage("Jersey number is required"),
    body("POSITION")
      .notEmpty()
      .isIn(["G", "F", "C", "G-F", "F-C", "F-G"])
      .withMessage("Invalid position"),
    body("HEIGHT")
      .notEmpty()
      .isString()
      .matches(/^\d{1}-\d{1,2}$/)
      .withMessage("Height must be in format X-Y (e.g., 6-8)"),
    body("WEIGHT")
      .notEmpty()
      .isInt({ min: 100, max: 350 })
      .withMessage("Weight must be between 100 and 350"),
    body("BIRTH_DATE")
      .notEmpty()
      .isString()
      .withMessage("Birth date is required"),
    body("AGE")
      .notEmpty()
      .isInt({ min: 18, max: 45 })
      .withMessage("Age must be between 18 and 45"),
    body("EXP")
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage("Experience must be a non-negative integer"),
    validateRequest,
  ],

  // PUT /api/team-roster/:id (Admin only)
  updateRosterEntry: [
    param("id").notEmpty().withMessage("Roster entry ID is required"),
    body("NUM").optional().isString(),
    body("POSITION").optional().isIn(["G", "F", "C", "G-F", "F-C", "F-G"]),
    body("HEIGHT")
      .optional()
      .matches(/^\d{1}-\d{1,2}$/)
      .withMessage("Height must be in format X-Y (e.g., 6-8)"),
    body("WEIGHT").optional().isInt({ min: 100, max: 350 }),
    body("AGE").optional().isInt({ min: 18, max: 45 }),
    body("EXP").optional().isInt({ min: 0 }),
    validateRequest,
  ],

  // DELETE /api/team-roster/:id (Admin only)
  deleteRosterEntry: [
    param("id").notEmpty().withMessage("Roster entry ID is required"),
    validateRequest,
  ],

  // Search roster
  searchRoster: [
    query("query")
      .notEmpty()
      .isString()
      .withMessage("Search query is required"),
    query("season")
      .optional()
      .isString()
      .withMessage("Season must be a valid string"),
    validateRequest,
  ],
};

module.exports = commonTeamRosterValidation;
