// server/routes/api/wrestlingNews.js
const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../../middleware/auth");
const { validateWrestlingNews } = require("../../middleware/newsValidation");
const { wrestlingNewsController } = require("../../controllers/newsController");
const upload = require("../../middleware/multer");

// Public routes - order matters, put specific routes before parameterized ones
router.get("/drafts", verifyToken, isAdmin, wrestlingNewsController.getDrafts);
router.get("/category/:category", wrestlingNewsController.getNewsByCategory);
router.get("/slug/:slug", wrestlingNewsController.getNewsBySlug);
router.get("/", wrestlingNewsController.getAllNews);

// Protected routes
router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.single("image"),
  validateWrestlingNews,
  wrestlingNewsController.createNews
);
router.put(
  "/slug/:slug",
  verifyToken,
  isAdmin,
  upload.single("image"),
  validateWrestlingNews,
  wrestlingNewsController.updateNewsBySlug
);
router.delete(
  "/slug/:slug",
  verifyToken,
  isAdmin,
  wrestlingNewsController.deleteNews
);

module.exports = router;
