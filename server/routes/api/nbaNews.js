const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../../middleware/auth");
const { validateNBANews } = require("../../middleware/newsValidation");
const { nbaNewsController } = require("../../controllers/newsController");
const upload = require("../../middleware/multer");

// Public routes - order matters, put specific routes before parameterized ones
router.get("/drafts", verifyToken, isAdmin, nbaNewsController.getDrafts);
router.get("/category/:category", nbaNewsController.getNewsByCategory);
router.get("/slug/:slug", nbaNewsController.getNewsBySlug);
router.get("/", nbaNewsController.getAllNews);

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
router.delete(
  "/slug/:slug",
  verifyToken,
  isAdmin,
  nbaNewsController.deleteNews
);

module.exports = router;
