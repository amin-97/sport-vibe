// server/routes/api/commonTeamRoster.js
const express = require("express");
const router = express.Router();
const commonTeamRosterController = require("../../controllers/commonTeamRosterController");
const validation = require("../../middleware/commonTeamRosterValidation");
const { verifyToken, isAdmin } = require("../../middleware/auth");

// GET roster list
router.get(
  "/",
  validation.getRosterList,
  commonTeamRosterController.getRosterList
);

// GET player by identifier
router.get(
  "/player/:identifier",
  validation.getPlayerByIdentifier,
  commonTeamRosterController.getPlayerByIdentifier
);

// Search roster
router.get(
  "/search",
  validation.searchRoster,
  commonTeamRosterController.searchRoster
);

// Protected routes (admin only)
// POST create new roster entry
router.post(
  "/",
  verifyToken,
  isAdmin,
  validation.createRosterEntry,
  commonTeamRosterController.createRosterEntry
);

// PUT update roster entry
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  validation.updateRosterEntry,
  commonTeamRosterController.updateRosterEntry
);

// DELETE roster entry
router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  validation.deleteRosterEntry,
  commonTeamRosterController.deleteRosterEntry
);

module.exports = router;
