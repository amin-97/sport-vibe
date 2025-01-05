// server/controllers/commonTeamRosterController.js
const CommonTeamRoster = require("../models/CommonTeamRoster");

const commonTeamRosterController = {
  // Get roster list with filtering
  getRosterList: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 25;
      const skip = (page - 1) * limit;

      // Build filter based on query parameters
      const filter = {};
      if (req.query.teamId) {
        filter.TeamID = req.query.teamId;
      }
      if (req.query.season) {
        filter.SEASON = req.query.season;
      }
      if (req.query.position) {
        filter.POSITION = req.query.position;
      }

      // Find roster entries with pagination
      const rosterEntries = await CommonTeamRoster.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ PLAYER: 1 });

      // Count total roster entries
      const total = await CommonTeamRoster.countDocuments(filter);

      res.json({
        rosterEntries,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPlayers: total,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get player by identifier
  getPlayerByIdentifier: async (req, res) => {
    try {
      const { identifier } = req.params;
      const { season } = req.query;

      const players = await CommonTeamRoster.findPlayer(identifier, season);

      if (!players.length) {
        return res.status(404).json({ message: "Player not found" });
      }

      res.json(players);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create new roster entry
  createRosterEntry: async (req, res) => {
    try {
      // Check if player already exists for this team and season
      const existingEntry = await CommonTeamRoster.findOne({
        TeamID: req.body.TeamID,
        SEASON: req.body.SEASON,
        PLAYER_ID: req.body.PLAYER_ID,
      });

      if (existingEntry) {
        return res.status(400).json({
          message:
            "Player already exists in this team's roster for the given season",
        });
      }

      const newRosterEntry = new CommonTeamRoster(req.body);
      await newRosterEntry.save();

      res.status(201).json(newRosterEntry);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update roster entry
  updateRosterEntry: async (req, res) => {
    try {
      const rosterEntry = await CommonTeamRoster.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!rosterEntry) {
        return res.status(404).json({ message: "Roster entry not found" });
      }

      res.json(rosterEntry);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete roster entry
  deleteRosterEntry: async (req, res) => {
    try {
      const rosterEntry = await CommonTeamRoster.findByIdAndDelete(
        req.params.id
      );

      if (!rosterEntry) {
        return res.status(404).json({ message: "Roster entry not found" });
      }

      res.json({ message: "Roster entry deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Search roster
  searchRoster: async (req, res) => {
    try {
      const { query } = req.query;
      const { season } = req.query;

      const searchFilter = {
        $or: [
          { PLAYER: new RegExp(query, "i") },
          { NICKNAME: new RegExp(query, "i") },
          { SCHOOL: new RegExp(query, "i") },
        ],
      };

      // Add season filter if provided
      if (season) {
        searchFilter.SEASON = season;
      }

      const players = await CommonTeamRoster.find(searchFilter).limit(10);

      res.json(players);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = commonTeamRosterController;
