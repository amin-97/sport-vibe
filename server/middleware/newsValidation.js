// server/middleware/newsValidation.js
const { body, validationResult } = require("express-validator");

const validateWrestlingNews = [
  // Allow drafts with just title
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 1 })
    .withMessage("Title cannot be empty"),

  // Category validation
  body("category")
    .if(body("status").not().equals("draft"))
    .isIn(["wwe", "aew"])
    .withMessage("Category must be either WWE or AEW"),

  // Only validate these fields for published content
  body("description")
    .if(body("status").equals("published"))
    .trim()
    .notEmpty()
    .withMessage("Description is required for published content")
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters"),

  body("content")
    .if(body("status").equals("published"))
    .trim()
    .notEmpty()
    .withMessage("Content is required for published content")
    .isLength({ min: 50 })
    .withMessage("Content must be at least 50 characters"),

  // Optional fields validation
  body("tags")
    .optional()
    .custom((value) => {
      try {
        const tags = JSON.parse(value);
        return Array.isArray(tags);
      } catch {
        throw new Error("Tags must be a valid JSON array");
      }
    }),

  // Status validation
  body("status")
    .optional()
    .isIn(["draft", "published"])
    .withMessage("Status must be either draft or published"),

  // Check the results of validation
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateNBANews = [
  // Allow drafts with just title
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 1 })
    .withMessage("Title cannot be empty"),

  // Category validation
  body("category")
    .if(body("status").not().equals("draft"))
    .isIn(["news", "trades", "rumors", "injuries", "game-recap", "analysis"])
    .withMessage("Invalid category for NBA news"),

  // Only validate these fields for published content
  body("description")
    .if(body("status").equals("published"))
    .trim()
    .notEmpty()
    .withMessage("Description is required for published content")
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters"),

  body("content")
    .if(body("status").equals("published"))
    .trim()
    .notEmpty()
    .withMessage("Content is required for published content")
    .isLength({ min: 50 })
    .withMessage("Content must be at least 50 characters"),

  // Optional fields validation
  body("tags")
    .optional()
    .custom((value) => {
      try {
        const tags = JSON.parse(value);
        return Array.isArray(tags);
      } catch {
        throw new Error("Tags must be a valid JSON array");
      }
    }),

  body("teams")
    .optional()
    .custom((value) => {
      try {
        const teams = JSON.parse(value);
        return Array.isArray(teams);
      } catch {
        throw new Error("Teams must be a valid JSON array");
      }
    }),

  body("players")
    .optional()
    .custom((value) => {
      try {
        const players = JSON.parse(value);
        return Array.isArray(players);
      } catch {
        throw new Error("Players must be a valid JSON array");
      }
    }),

  // Featured validation
  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured must be a boolean value"),

  // Status validation
  body("status")
    .optional()
    .isIn(["draft", "published"])
    .withMessage("Status must be either draft or published"),

  // Check the results of validation
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Image validation middleware
const validateImage = (req, res, next) => {
  if (!req.file) {
    if (req.body.status === "published") {
      return res.status(400).json({
        errors: [{ msg: "Image is required for published content" }],
      });
    }
    return next();
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({
      errors: [{ msg: "Invalid image type. Allowed types: JPG, PNG, WebP" }],
    });
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (req.file.size > maxSize) {
    return res.status(400).json({
      errors: [{ msg: "Image size must be less than 5MB" }],
    });
  }

  next();
};

module.exports = {
  validateWrestlingNews,
  validateNBANews,
  validateImage,
};
