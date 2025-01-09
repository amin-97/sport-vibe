// server/controllers/tradesController.js
const Trade = require("../models/Trade");
const CommonTeamRoster = require("../models/CommonTeamRoster");

const tradesController = {
  executeTrade: async (req, res) => {
    try {
      const { teams, tradedPlayers, tradedPicks } = req.body;

      // Create trade record
      const trade = new Trade({
        teams: teams.map((team) => team.id),
        tradedPlayers,
        tradedPicks,
        executedBy: req.user.id,
        status: "completed",
      });

      await trade.save();

      // Update rosters
      for (const [teamId, players] of Object.entries(tradedPlayers)) {
        for (const player of players) {
          await CommonTeamRoster.findOneAndUpdate(
            { PLAYER_ID: player.PLAYER_ID },
            { TeamID: teamId },
            { new: true }
          );
        }
      }

      res.status(200).json({ message: "Trade executed successfully", trade });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getTradeHistory: async (req, res) => {
    try {
      const trades = await Trade.find().sort({ createdAt: -1 }).limit(10);
      res.json(trades);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getTradeById: async (req, res) => {
    try {
      const trade = await Trade.findById(req.params.id);
      if (!trade) {
        return res.status(404).json({ message: "Trade not found" });
      }
      res.json(trade);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = tradesController;
