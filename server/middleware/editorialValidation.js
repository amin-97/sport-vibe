// server/middleware/editorialValidation.js
const { body, validationResult } = require("express-validator");

const validateNBAEditorial = [
  // Only validate that title exists for drafts
  body("title")
    .trim()
    .custom((value, { req }) => {
      if (req.body.status === "draft") {
        return value.length >= 1;
      }
      return value.length >= 5;
    })
    .withMessage((value, { req }) => {
      if (req.body.status === "draft") {
        return "Title is required for drafts";
      }
      return "Title must be at least 5 characters for published content";
    }),

  // All other validations only apply to published content
  body("summary")
    .if(body("status").equals("published"))
    .trim()
    .notEmpty()
    .withMessage("Summary is required for published content")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Summary must be between 10 and 1000 characters"),

  body("content")
    .if(body("status").equals("published"))
    .trim()
    .notEmpty()
    .withMessage("Content is required for published content")
    .isLength({ min: 100 })
    .withMessage("Content must be at least 100 characters long"),

  body("keyArguments")
    .if(body("status").equals("published"))
    .custom((value) => {
      try {
        const args = JSON.parse(value);
        return Array.isArray(args) && args.length > 0;
      } catch {
        return false;
      }
    })
    .withMessage("At least one key argument is required for published content"),

  body("topics")
    .optional()
    .custom((value) => {
      if (!value) return true;
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
      if (!value) return true;
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
      if (!value) return true;
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

const validateWrestlingEditorial = [
  // Only validate that title exists for drafts
  body("title")
    .trim()
    .custom((value, { req }) => {
      if (req.body.status === "draft") {
        return value.length >= 1;
      }
      return value.length >= 5;
    })
    .withMessage((value, { req }) => {
      if (req.body.status === "draft") {
        return "Title is required for drafts";
      }
      return "Title must be at least 5 characters for published content";
    }),

  // All other validations only apply to published content
  body("summary")
    .if(body("status").equals("published"))
    .trim()
    .notEmpty()
    .withMessage("Summary is required for published content")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Summary must be between 10 and 1000 characters"),

  body("content")
    .if(body("status").equals("published"))
    .trim()
    .notEmpty()
    .withMessage("Content is required for published content")
    .isLength({ min: 100 })
    .withMessage("Content must be at least 100 characters long"),

  body("category")
    .if(body("status").equals("published"))
    .trim()
    .notEmpty()
    .withMessage("Category is required for published content")
    .isIn(["wrestling"])
    .withMessage("Category must be wrestling"),

  body("keyArguments")
    .if(body("status").equals("published"))
    .custom((value) => {
      try {
        if (!value) return false;
        const args = JSON.parse(value);
        return Array.isArray(args) && args.length > 0;
      } catch {
        return false;
      }
    })
    .withMessage("At least one key argument is required for published content"),

  body("topics")
    .optional()
    .custom((value) => {
      if (!value) return true;
      try {
        const topics = JSON.parse(value);
        return Array.isArray(topics);
      } catch {
        return false;
      }
    })
    .withMessage("Topics must be an array"),

  body("status")
    .trim()
    .notEmpty()
    .isIn(["draft", "published"])
    .withMessage("Status must be either 'draft' or 'published'"),

  (req, res, next) => {
    console.log("Validation body:", req.body); // Add this for debugging
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateNBAEditorial, validateWrestlingEditorial };
