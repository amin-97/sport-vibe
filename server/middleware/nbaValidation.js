const { body, validationResult } = require("express-validator");

const validateNBANews = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 5, max: 200 })
    .withMessage("Title must be between 5 and 200 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 100 })
    .withMessage("Content must be at least 100 characters long"),

  body("category")
    .isIn(["news", "trades", "rumors", "injuries", "game-recap", "analysis"])
    .withMessage("Invalid category"),

  body("tags")
    .optional()
    .custom((value) => {
      try {
        const tags = JSON.parse(value);
        return Array.isArray(tags);
      } catch {
        return false;
      }
    })
    .withMessage("Tags must be an array"),

  body("teams")
    .optional()
    .custom((value) => {
      try {
        const teams = JSON.parse(value);
        return Array.isArray(teams);
      } catch {
        return false;
      }
    })
    .withMessage("Teams must be an array"),

  body("players")
    .optional()
    .custom((value) => {
      try {
        const players = JSON.parse(value);
        return Array.isArray(players);
      } catch {
        return false;
      }
    })
    .withMessage("Players must be an array"),

  body("status")
    .optional()
    .isIn(["draft", "published"])
    .withMessage("Invalid status"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateNBAEditorial = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 5, max: 200 })
    .withMessage("Title must be between 5 and 200 characters"),

  body("summary")
    .trim()
    .notEmpty()
    .withMessage("Summary is required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Summary must be between 10 and 1000 characters"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 100 })
    .withMessage("Content must be at least 100 characters long"),

  body("keyArguments")
    .custom((value) => {
      try {
        const args = JSON.parse(value);
        return Array.isArray(args) && args.length > 0;
      } catch {
        return false;
      }
    })
    .withMessage("At least one key argument is required"),

  body("topics")
    .optional()
    .custom((value) => {
      try {
        const topics = JSON.parse(value);
        return Array.isArray(topics);
      } catch {
        return false;
      }
    })
    .withMessage("Topics must be an array"),

  body("teams")
    .optional()
    .custom((value) => {
      try {
        const teams = JSON.parse(value);
        return Array.isArray(teams);
      } catch {
        return false;
      }
    })
    .withMessage("Teams must be an array"),

  body("players")
    .optional()
    .custom((value) => {
      try {
        const players = JSON.parse(value);
        return Array.isArray(players);
      } catch {
        return false;
      }
    })
    .withMessage("Players must be an array"),

  body("status")
    .optional()
    .isIn(["draft", "published"])
    .withMessage("Invalid status"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateNBANews, validateNBAEditorial };
