// server/routes/api/wrestlingResults.js
const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../../middleware/auth");
const {
  validateWrestlingResult,
} = require("../../middleware/wrestlingResultsValidation");
const wrestlingResultsController = require("../../controllers/wrestlingResultsController");
const upload = require("../../middleware/multer");

// Public routes - these will automatically filter out drafts for non-admin users
router.get("/", verifyToken, wrestlingResultsController.getAllWrestlingResults);
router.get(
  "/slug/:slug",
  verifyToken,
  wrestlingResultsController.getWrestlingResultBySlug
);
router.get(
  "/promotion/:promotion",
  verifyToken,
  wrestlingResultsController.getWrestlingResultsByPromotion
);

// Admin-only routes
router.get(
  "/drafts",
  verifyToken,
  isAdmin,
  wrestlingResultsController.getDrafts
);

// Protected routes for creating/updating content
router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "additionalImages", maxCount: 5 },
  ]),
  validateWrestlingResult,
  wrestlingResultsController.createWrestlingResult
);

router.put(
  "/slug/:slug",
  verifyToken,
  isAdmin,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "additionalImages", maxCount: 5 },
  ]),
  validateWrestlingResult,
  wrestlingResultsController.updateWrestlingResult
);

// Add this to your routes in wrestlingResults.js
router.delete(
  "/slug/:slug",
  verifyToken,
  isAdmin,
  wrestlingResultsController.deleteWrestlingResult
);

module.exports = router;
