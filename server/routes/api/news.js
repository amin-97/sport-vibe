// server/routes/api/news.js
const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../../middleware/auth");
const validateNews = require("../../middleware/newsValidation");
const newsController = require("../../controllers/newsController");
const upload = require("../../middleware/multer");

// Make sure all required middleware functions are defined before using them
router.get("/", newsController.getAllNews);
router.get("/:id", newsController.getNewsById);
router.get("/category/:category", newsController.getNewsByCategory);

// Check if all middleware functions exist
console.log({
  validateNews: !!validateNews,
  verifyToken: !!verifyToken,
  isAdmin: !!isAdmin,
  newsController: !!newsController.createNews,
});

router.post(
  "/",
  verifyToken, // Authentication middleware
  isAdmin, // Admin check middleware
  upload.single("image"), // Multer middleware for file upload
  validateNews, // Validation middleware
  newsController.createNews // Controller function
);

router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload.single("image"),
  validateNews,
  newsController.updateNews
);

router.delete("/:id", verifyToken, isAdmin, newsController.deleteNews);

module.exports = router;
