// server/routes/api/editorials.js
const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../../middleware/auth");
const validateWrestlingEditorial = require("../../middleware/wrestlingEditorialValidation");
const wrestlingEditorialController = require("../../controllers/wrestlingEditorialController");
const upload = require("../../middleware/multer");

// Check if all imports are properly defined
console.log("Checking middleware and controller:", {
  validateWrestlingEditorial: !!validateWrestlingEditorial,
  wrestlingEditorialController:
    !!wrestlingEditorialController?.createWrestlingEditorial,
  verifyToken: !!verifyToken,
  isAdmin: !!isAdmin,
  upload: !!upload,
});

// Define routes
router.get("/", wrestlingEditorialController.getAllWrestlingEditorials);
router.get("/:id", wrestlingEditorialController.getWrestlingEditorialById);
router.get(
  "/category/:category",
  wrestlingEditorialController.getWrestlingEditorialsByCategory
);
router.get(
  "/slug/:slug",
  wrestlingEditorialController.getWrestlingEditorialBySlug
);
router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.single("image"),
  validateWrestlingEditorial,
  wrestlingEditorialController.createWrestlingEditorial
);

router.put(
  "/slug/:slug",
  verifyToken,
  isAdmin,
  upload.single("image"),
  validateWrestlingEditorial,
  wrestlingEditorialController.updateWrestlingEditorialBySlug // Make sure this method exists
);

router.delete(
  "/slug/:slug",
  verifyToken,
  isAdmin,
  wrestlingEditorialController.deleteWrestlingEditorial
);

// Add to wrestlingEditorials.js routes
router.get(
  "/drafts",
  verifyToken,
  isAdmin,
  wrestlingEditorialController.getWrestlingEditorialDrafts
);

module.exports = router;
