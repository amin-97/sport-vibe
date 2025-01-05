// server/middleware/validation/teamsValidation.js
const { body, query, param, validationResult } = require("express-validator");

// Helper function to handle validation results
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const teamsValidation = {
  // GET /api/teams
  getTeamsList: [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage("Limit must be between 1 and 50"),
    query("state")
      .optional()
      .isString()
      .withMessage("State must be a valid string"),
    query("year_founded")
      .optional()
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage("Year founded must be a valid year"),
    validateRequest,
  ],

  // GET /api/teams/:identifier
  getTeamByIdentifier: [
    param("identifier").notEmpty().withMessage("Team identifier is required"),
    validateRequest,
  ],

  // POST /api/teams (Admin only)
  createTeam: [
    body("id").notEmpty().withMessage("ID is required"),
    body("full_name")
      .notEmpty()
      .isString()
      .withMessage("Full name is required"),
    body("abbreviation")
      .notEmpty()
      .isString()
      .isLength({ min: 2, max: 3 })
      .withMessage("Abbreviation must be 2-3 characters"),
    body("nickname").notEmpty().isString().withMessage("Nickname is required"),
    body("city").notEmpty().isString().withMessage("City is required"),
    body("state").notEmpty().isString().withMessage("State is required"),
    body("year_founded")
      .notEmpty()
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage("Year founded must be a valid year"),
    body("conference")
      .optional()
      .isIn(["Eastern", "Western"])
      .withMessage("Conference must be either Eastern or Western"),
    body("division")
      .optional()
      .isIn([
        "Atlantic",
        "Central",
        "Southeast",
        "Northwest",
        "Pacific",
        "Southwest",
      ])
      .withMessage("Invalid division"),
    validateRequest,
  ],

  // PUT /api/teams/:id (Admin only)
  updateTeam: [
    param("id").notEmpty().withMessage("Team ID is required"),
    body("full_name").optional().isString(),
    body("abbreviation").optional().isString().isLength({ min: 2, max: 3 }),
    body("nickname").optional().isString(),
    body("city").optional().isString(),
    body("state").optional().isString(),
    body("year_founded")
      .optional()
      .isInt({ min: 1900, max: new Date().getFullYear() }),
    body("conference").optional().isIn(["Eastern", "Western"]),
    body("division")
      .optional()
      .isIn([
        "Atlantic",
        "Central",
        "Southeast",
        "Northwest",
        "Pacific",
        "Southwest",
      ]),
    validateRequest,
  ],

  // DELETE /api/teams/:id (Admin only)
  deleteTeam: [
    param("id").notEmpty().withMessage("Team ID is required"),
    validateRequest,
  ],

  // Search teams
  searchTeams: [
    query("query")
      .notEmpty()
      .isString()
      .withMessage("Search query is required"),
    validateRequest,
  ],
};

module.exports = teamsValidation;
