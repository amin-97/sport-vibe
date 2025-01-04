// server/routes/api/wrestlingResults.js
const express = require("express");
const router = express.Router();
const { wrestlingResultsUpload } = require("../../middleware/upload");
const {
  validateWrestlingResult,
} = require("../../middleware/wrestlingResultsValidation");
const { verifyToken, isAdmin } = require("../../middleware/auth");
const {
  createResult,
} = require("../../controllers/wrestlingResultsController");

router.post(
  "/create",
  verifyToken,
  isAdmin,
  wrestlingResultsUpload,
  validateWrestlingResult,
  createResult
);

module.exports = router;
