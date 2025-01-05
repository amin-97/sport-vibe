// server/routes/api/wrestlingResults.js
const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../../middleware/auth");
const {
  validateWrestlingResult,
} = require("../../middleware/wrestlingResultsValidation");
const wrestlingResultsController = require("../../controllers/wrestlingResultsController");
const upload = require("../../middleware/multer");

// Public routes
router.get("/", wrestlingResultsController.getAllWrestlingResults);
router.get("/slug/:slug", wrestlingResultsController.getWrestlingResultBySlug);
router.get(
  "/promotion/:promotion",
  wrestlingResultsController.getWrestlingResultsByPromotion
);
// Protected routes
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

module.exports = router;
