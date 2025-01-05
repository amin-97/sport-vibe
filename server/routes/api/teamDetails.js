// server/routes/api/teamDetails.js
const express = require("express");
const router = express.Router();
const teamDetailsController = require("../../controllers/teamDetailsController");
const validation = require("../../middleware/teamDetailsValidation");
const { verifyToken, isAdmin } = require("../../middleware/auth");

// GET all team details
router.get(
  "/",
  validation.getTeamDetailsList,
  teamDetailsController.getAllTeamDetails
);

// GET team details by identifier
router.get(
  "/:identifier",
  validation.getTeamDetailsByIdentifier,
  teamDetailsController.getTeamDetailsByIdentifier
);

// Search team details
router.get(
  "/search/query",
  validation.searchTeamDetails,
  teamDetailsController.searchTeamDetails
);

// Protected routes (admin only)
// POST create new team details
router.post(
  "/",
  verifyToken,
  isAdmin,
  validation.createTeamDetails,
  teamDetailsController.createTeamDetails
);

// PUT update team details
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  validation.updateTeamDetails,
  teamDetailsController.updateTeamDetails
);

// DELETE team details
router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  validation.deleteTeamDetails,
  teamDetailsController.deleteTeamDetails
);

module.exports = router;
