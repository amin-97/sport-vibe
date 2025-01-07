// server/controllers/teamDetailsController.js
const TeamDetails = require("../models/TeamDetails");

const teamDetailsController = {
  // Get all team details with pagination
  getAllTeamDetails: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 25;
      const skip = (page - 1) * limit;

      // Build filter based on query parameters
      const filter = {};
      if (req.query.city) {
        filter.CITY = req.query.city;
      }
      if (req.query.yearFounded) {
        filter.YEARFOUNDED = req.query.yearFounded;
      }

      // Find team details with pagination
      const teamDetails = await TeamDetails.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ CITY: 1 });

      // Count total team details
      const total = await TeamDetails.countDocuments(filter);

      res.json({
        teamDetails,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalTeams: total,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get team details by identifier
  getTeamDetailsByIdentifier: async (req, res) => {
    try {
      const teamDetails = await TeamDetails.findByIdentifier(
        req.params.identifier
      );

      if (!teamDetails) {
        return res.status(404).json({ message: "Team details not found" });
      }

      res.json(teamDetails);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create new team details
  createTeamDetails: async (req, res) => {
    try {
      // Check if team details with same ID or abbreviation already exists
      const existingTeamDetails = await TeamDetails.findOne({
        $or: [
          { TEAM_ID: req.body.TEAM_ID },
          { ABBREVIATION: req.body.ABBREVIATION },
        ],
      });

      if (existingTeamDetails) {
        return res.status(400).json({
          message: "Team details with this ID or abbreviation already exists",
        });
      }

      const newTeamDetails = new TeamDetails(req.body);
      await newTeamDetails.save();

      res.status(201).json(newTeamDetails);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update existing team details
  updateTeamDetails: async (req, res) => {
    try {
      const teamDetails = await TeamDetails.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!teamDetails) {
        return res.status(404).json({ message: "Team details not found" });
      }

      res.json(teamDetails);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete team details
  deleteTeamDetails: async (req, res) => {
    try {
      const teamDetails = await TeamDetails.findByIdAndDelete(req.params.id);

      if (!teamDetails) {
        return res.status(404).json({ message: "Team details not found" });
      }

      res.json({ message: "Team details deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Search team details
  // In teamDetailsController.js
  // In teamDetailsController.js
  searchTeamDetails: async (req, res) => {
    try {
      const { query } = req.query;
      // console.log("Search Query Received:", query); // Add this logging

      const teamDetails = await TeamDetails.find({
        $or: [
          { CITY: new RegExp(query, "i") },
          { NICKNAME: new RegExp(query, "i") },
          { ABBREVIATION: new RegExp(query, "i") },
          { TEAM_ID: query },
        ],
      }).limit(10);

      // console.log("Search Results:", teamDetails); // Add this logging

      if (teamDetails.length === 0) {
        // console.log(`No team found for query: ${query}`); // Add this logging
        return res.status(404).json({ message: "No team details found" });
      }

      res.json(teamDetails);
    } catch (error) {
      console.error("Search Error:", error);
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = teamDetailsController;
