// server/routes/api/nbaEditorials.js
const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../../middleware/auth");
const { validateNBAEditorial } = require("../../middleware/nbaValidation");
const nbaEditorialController = require("../../controllers/nbaEditorialController");
const upload = require("../../middleware/multer");

// Public routes
router.get("/", nbaEditorialController.getAllEditorials);
router.get("/slug/:slug", nbaEditorialController.getEditorialBySlug);
router.get("/featured", nbaEditorialController.getFeaturedEditorials);

// Protected routes
router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.single("image"),
  validateNBAEditorial,
  nbaEditorialController.createEditorial
);

// Add this route to the existing routes
router.put(
  "/slug/:slug",
  verifyToken,
  isAdmin,
  upload.single("image"),
  validateNBAEditorial,
  nbaEditorialController.updateEditorialBySlug
);

router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  nbaEditorialController.deleteEditorial
);

module.exports = router;
