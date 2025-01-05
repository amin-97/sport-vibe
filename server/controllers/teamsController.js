// server/controllers/teamsController.js
const Teams = require("../models/Teams");

const teamsController = {
  // Get all teams with pagination
  getAllTeams: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 25;
      const skip = (page - 1) * limit;

      // Build filter based on query parameters
      const filter = {};
      if (req.query.state) {
        filter.state = req.query.state;
      }
      if (req.query.year_founded) {
        filter.year_founded = req.query.year_founded;
      }

      // Find teams with pagination
      const teams = await Teams.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ full_name: 1 });

      // Count total teams
      const total = await Teams.countDocuments(filter);

      res.json({
        teams,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalTeams: total,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get team by identifier (ID, abbreviation, full name, or nickname)
  getTeamByIdentifier: async (req, res) => {
    try {
      const team = await Teams.findByIdentifier(req.params.identifier);

      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }

      res.json(team);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create a new team
  createTeam: async (req, res) => {
    try {
      // Check if team with same ID or abbreviation already exists
      const existingTeam = await Teams.findOne({
        $or: [{ id: req.body.id }, { abbreviation: req.body.abbreviation }],
      });

      if (existingTeam) {
        return res.status(400).json({
          message: "Team with this ID or abbreviation already exists",
        });
      }

      const newTeam = new Teams(req.body);
      await newTeam.save();

      res.status(201).json(newTeam);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update an existing team
  updateTeam: async (req, res) => {
    try {
      const team = await Teams.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }

      res.json(team);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete a team
  deleteTeam: async (req, res) => {
    try {
      const team = await Teams.findByIdAndDelete(req.params.id);

      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }

      res.json({ message: "Team deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Search teams
  searchTeams: async (req, res) => {
    try {
      const { query } = req.query;
      const teams = await Teams.find({
        $or: [
          { full_name: new RegExp(query, "i") },
          { nickname: new RegExp(query, "i") },
          { city: new RegExp(query, "i") },
          { state: new RegExp(query, "i") },
        ],
      }).limit(10);

      res.json(teams);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = teamsController;
