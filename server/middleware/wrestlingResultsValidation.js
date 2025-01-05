const { body, validationResult } = require("express-validator");

const validateWrestlingResult = [
  body("name").trim().notEmpty().withMessage("Event name is required"),

  body("date")
    .notEmpty()
    .withMessage("Event date is required")
    .isISO8601()
    .withMessage("Invalid date format"),

  body("venue").trim().notEmpty().withMessage("Venue is required"),

  body("promotion")
    .isIn(["WWE", "AEW"])
    .withMessage("Promotion must be either WWE or AEW"),

  body("status")
    .optional()
    .isIn(["draft", "published"])
    .withMessage("Status must be either draft or published"),

  body("matches")
    .custom((value) => {
      try {
        const matches = JSON.parse(value);
        if (!Array.isArray(matches)) return false;

        return matches.every(
          (match) =>
            match.type &&
            Array.isArray(match.wrestlers) &&
            match.wrestlers.length > 0 &&
            match.winner &&
            match.highlights &&
            match.thoughts
        );
      } catch {
        return false;
      }
    })
    .withMessage("Invalid matches format or missing required match fields"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateWrestlingResult };
