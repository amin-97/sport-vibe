// server/middleware/validation/teamDetailsValidation.js
const { body, query, param, validationResult } = require("express-validator");

// Helper function to handle validation results
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const teamDetailsValidation = {
  // GET /api/team-details
  getTeamDetailsList: [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage("Limit must be between 1 and 50"),
    query("city")
      .optional()
      .isString()
      .withMessage("City must be a valid string"),
    query("yearFounded")
      .optional()
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage("Year founded must be a valid year"),
    validateRequest,
  ],

  // GET /api/team-details/:identifier
  getTeamDetailsByIdentifier: [
    param("identifier").notEmpty().withMessage("Team identifier is required"),
    validateRequest,
  ],

  // POST /api/team-details (Admin only)
  createTeamDetails: [
    body("TEAM_ID").notEmpty().withMessage("TEAM_ID is required"),
    body("ABBREVIATION")
      .notEmpty()
      .isString()
      .isLength({ min: 2, max: 3 })
      .withMessage("ABBREVIATION must be 2-3 characters"),
    body("NICKNAME").notEmpty().isString().withMessage("NICKNAME is required"),
    body("YEARFOUNDED")
      .notEmpty()
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage("YEARFOUNDED must be a valid year"),
    body("CITY").notEmpty().isString().withMessage("CITY is required"),
    body("ARENA").notEmpty().isString().withMessage("ARENA is required"),
    body("ARENACAPACITY")
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage("ARENACAPACITY must be a positive number"),
    body("OWNER").notEmpty().isString().withMessage("OWNER is required"),
    body("GENERALMANAGER")
      .notEmpty()
      .isString()
      .withMessage("GENERALMANAGER is required"),
    body("HEADCOACH")
      .notEmpty()
      .isString()
      .withMessage("HEADCOACH is required"),
    validateRequest,
  ],

  // PUT /api/team-details/:id (Admin only)
  updateTeamDetails: [
    param("id").notEmpty().withMessage("Team ID is required"),
    body("ABBREVIATION").optional().isString().isLength({ min: 2, max: 3 }),
    body("YEARFOUNDED")
      .optional()
      .isInt({ min: 1900, max: new Date().getFullYear() }),
    body("ARENACAPACITY").optional().isInt({ min: 0 }),
    validateRequest,
  ],

  // DELETE /api/team-details/:id (Admin only)
  deleteTeamDetails: [
    param("id").notEmpty().withMessage("Team ID is required"),
    validateRequest,
  ],

  // Search team details
  searchTeamDetails: [
    query("query")
      .notEmpty()
      .isString()
      .withMessage("Search query is required"),
    validateRequest,
  ],
};

module.exports = teamDetailsValidation;
