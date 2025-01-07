// server/scripts/initDB.js
require("dotenv").config();
const path = require("path");
const { importPlayerStats } = require("./importPlayerStats");
const { importTeams } = require("./importTeams");
const { importTeamDetails } = require("./importTeamDetails");
const { importCommonTeamRoster } = require("./importCommonTeamRoster");

const initializeDatabase = async () => {
  try {
    // Import data from Excel files stored in a 'data' directory
    const dataDir = path.join(__dirname, "../data");
    await importPlayerStats(
      path.join(dataDir, "active_player_career_stats.xlsx")
    );
    await importTeams(path.join(dataDir, "Teams.xlsx"));
    await importTeamDetails(path.join(dataDir, "TeamDetails.xlsx"));
    await importCommonTeamRoster(path.join(dataDir, "CommonTeamRoster.xlsx"));
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
};

// Run if called directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;
