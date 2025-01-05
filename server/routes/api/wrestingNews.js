// server/routes/api/news.js
const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../../middleware/auth");
const validateWrestlingNews = require("../../middleware/wrestlingNewsValidation");
const wrestlingNewsController = require("../../controllers/wrestlingNewsController");
const upload = require("../../middleware/multer");

// Make sure all required middleware functions are defined before using them
router.get("/", wrestlingNewsController.getAllWrestlingNews);
router.get("/:id", wrestlingNewsController.getWrestlingNewsById);
router.get(
  "/category/:category",
  wrestlingNewsController.getWrestlingNewsByCategory
);
router.get("/slug/:slug", wrestlingNewsController.getWrestlingNewsBySlug);
// Check if all middleware functions exist
console.log({
  validateWrestlingNews: !!validateWrestlingNews,
  verifyToken: !!verifyToken,
  isAdmin: !!isAdmin,
  wrestlingNewsController: !!wrestlingNewsController.createWrestlingNews,
});

router.post(
  "/",
  verifyToken, // Authentication middleware
  isAdmin, // Admin check middleware
  upload.single("image"), // Multer middleware for file upload
  validateWrestlingNews, // Validation middleware
  wrestlingNewsController.createWrestlingNews // Controller function
);

router.put(
  "/slug/:slug",
  verifyToken,
  isAdmin,
  upload.single("image"),
  validateWrestlingNews,
  wrestlingNewsController.updateWrestlingNewsBySlug
);

router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  wrestlingNewsController.deleteWrestlingNews
);

// server/routes/api/wrestlingNews.js
router.get(
  "/drafts",
  verifyToken,
  isAdmin,
  wrestlingNewsController.getWrestlingNewsDrafts
);

module.exports = router;
