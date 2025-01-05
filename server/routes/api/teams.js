// server/routes/api/teams.js
const express = require("express");
const router = express.Router();
const teamsController = require("../../controllers/teamsController");
const validation = require("../../middleware/teamsValidation");
const { verifyToken, isAdmin } = require("../../middleware/auth");

// GET all teams
router.get("/", validation.getTeamsList, teamsController.getAllTeams);

// GET team by identifier
router.get(
  "/:identifier",
  validation.getTeamByIdentifier,
  teamsController.getTeamByIdentifier
);

// Search teams
router.get(
  "/search/query",
  validation.searchTeams,
  teamsController.searchTeams
);

// Protected routes (admin only)
// POST create a new team
router.post(
  "/",
  verifyToken,
  isAdmin,
  validation.createTeam,
  teamsController.createTeam
);

// PUT update a team
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  validation.updateTeam,
  teamsController.updateTeam
);

// DELETE a team
router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  validation.deleteTeam,
  teamsController.deleteTeam
);

module.exports = router;
