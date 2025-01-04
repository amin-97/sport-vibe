// server/middleware/wrestlingResultsValidation.js
const { body, validationResult } = require("express-validator");

const validateWrestlingResult = [
  body("name").trim().notEmpty().withMessage("Event name is required"),

  body("date")
    .notEmpty()
    .withMessage("Event date is required")
    .isISO8601()
    .withMessage("Invalid date format"),

  body("venue").trim().notEmpty().withMessage("Venue is required"),

  body("promotion").isIn(["WWE", "AEW"]).withMessage("Invalid promotion"),

  // server/middleware/wrestlingResultsValidation.js
  body("matches")
    .custom((value) => {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed);
      } catch {
        return false;
      }
    })
    .withMessage("Matches must be an array"),

  // Add validation for nested match data here if needed

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateWrestlingResult };
