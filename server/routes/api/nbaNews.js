// server/routes/api/nbaArticles.js
const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../../middleware/auth");
const { validateNBANews } = require("../../middleware/nbaValidation");
const nbaNewsController = require("../../controllers/nbaNewsController");
const upload = require("../../middleware/multer");

// Public routes
router.get("/", nbaNewsController.getAllNews);
router.get("/slug/:slug", nbaNewsController.getNewsBySlug);
router.get("/category/:category", nbaNewsController.getNewsByCategory);

// Protected routes
router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.single("image"),
  validateNBANews,
  nbaNewsController.createNews
);

router.put(
  "/slug/:slug",
  verifyToken,
  isAdmin,
  upload.single("image"),
  validateNBANews,
  nbaNewsController.updateNewsBySlug
);

router.delete("/:id", verifyToken, isAdmin, nbaNewsController.deleteNews);

module.exports = router;
