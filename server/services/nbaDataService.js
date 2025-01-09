// server/services/nbaDataService.js
const NBA = require("nba");
const fs = require("fs").promises;
const path = require("path");
const schedule = require("node-schedule");

class NBADataService {
  constructor() {
    this.teamIds = [
      1610612737, 1610612738, 1610612739, 1610612740, 1610612741, 1610612742,
      1610612743, 1610612744, 1610612745, 1610612746, 1610612747, 1610612748,
      1610612749, 1610612750, 1610612751, 1610612752, 1610612753, 1610612754,
      1610612755, 1610612756, 1610612757, 1610612758, 1610612759, 1610612760,
      1610612761, 1610612762, 1610612763, 1610612764, 1610612765, 1610612766,
    ];
    this.dataDir = path.join(__dirname, "../data");
  }

  async ensureDataDirectory() {
    try {
      await fs.access(this.dataDir);
    } catch {
      await fs.mkdir(this.dataDir, { recursive: true });
    }
  }

  // Helper function for delay
  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async fetchTeamRoster(teamId) {
    try {
      console.log(`Fetching roster for team ${teamId}`);
      const response = await NBA.stats.commonTeamRoster({ TeamID: teamId });

      // Log the full response to understand its structure
      console.log("Full response:", JSON.stringify(response, null, 2));

      // Add more robust checking of response structure
      if (
        !response ||
        !response.resultSets ||
        !Array.isArray(response.resultSets)
      ) {
        console.error(`Invalid response structure for team ${teamId}`);
        return null;
      }

      // Find the roster result set
      const rosterResultSet = response.resultSets.find(
        (set) => set.name === "CommonTeamRoster" || set.headers
      );

      if (!rosterResultSet || !rosterResultSet.rowSet) {
        console.error(`No roster data found for team ${teamId}`);
        return null;
      }

      const rosterData = rosterResultSet.rowSet.map((player) => {
        // Use the headers to dynamically map columns
        const headers = rosterResultSet.headers;
        const playerData = {};

        headers.forEach((header, index) => {
          switch (header) {
            case "TEAM_ID":
              playerData.teamId = player[index];
              break;
            case "PLAYER_ID":
              playerData.playerId = player[index];
              break;
            case "PLAYER":
              playerData.player = player[index];
              break;
            case "NUM":
              playerData.number = player[index];
              break;
            case "POSITION":
              playerData.position = player[index];
              break;
            case "HEIGHT":
              playerData.height = player[index];
              break;
            case "WEIGHT":
              playerData.weight = player[index];
              break;
            case "BIRTH_DATE":
              playerData.birthDate = player[index];
              break;
            case "AGE":
              playerData.age = player[index];
              break;
            case "EXP":
              playerData.experience = player[index];
              break;
            case "SCHOOL":
              playerData.school = player[index];
              break;
          }
        });

        return playerData;
      });

      console.log(
        `Successfully fetched ${rosterData.length} players for team ${teamId}`
      );
      return rosterData;
    } catch (error) {
      console.error(
        `Detailed error fetching roster for team ${teamId}:`,
        error
      );

      // If it's a network or API-specific error, you might want to log more details
      if (error.response) {
        console.error("Error response:", error.response.data);
      }

      return null;
    }
  }

  async fetchAllRosters() {
    console.log(`Starting roster update at ${new Date().toISOString()}`);
    await this.ensureDataDirectory();

    const rosters = [];
    const failedTeams = [];

    for (const teamId of this.teamIds) {
      try {
        await this.delay(1000); // Add delay to avoid rate limiting
        const roster = await this.fetchTeamRoster(teamId);

        if (roster && roster.length > 0) {
          rosters.push(...roster);
        } else {
          failedTeams.push(teamId);
        }
      } catch (error) {
        console.error(`Error processing team ${teamId}:`, error);
        failedTeams.push(teamId);
      }
    }

    if (rosters.length > 0) {
      try {
        // Save to JSON file
        const jsonPath = path.join(this.dataDir, "CommonTeamRoster.json");
        const rosterData = {
          timestamp: new Date().toISOString(),
          data: rosters,
          failedTeams: failedTeams,
        };

        await fs.writeFile(jsonPath, JSON.stringify(rosterData, null, 2));

        console.log(
          `Successfully saved rosters. Total teams: ${this.teamIds.length}, Successful: ${rosters.length}, Failed: ${failedTeams.length}`
        );

        if (failedTeams.length > 0) {
          console.log("Failed team IDs:", failedTeams);
        }

        return rosterData;
      } catch (error) {
        console.error("Error saving rosters:", error);
        return null;
      }
    } else {
      console.log("No roster data was collected");
      return null;
    }
  }
  async getLatestRosters() {
    try {
      const jsonPath = path.join(this.dataDir, "CommonTeamRoster.json");

      // Explicitly fetch rosters if the file doesn't exist
      try {
        await fs.access(jsonPath);
      } catch (accessError) {
        console.log("Roster data file does not exist. Fetching rosters...");
        await this.fetchAllRosters();
      }

      // Read the JSON file
      const fileContents = await fs.readFile(jsonPath, "utf8");
      const data = JSON.parse(fileContents);

      console.log("Latest rosters data retrieved successfully");
      return data;
    } catch (error) {
      console.error("Error reading roster data:", error);

      // If reading fails, attempt to fetch rosters again
      try {
        const freshRosters = await this.fetchAllRosters();
        return freshRosters
          ? {
              timestamp: new Date().toISOString(),
              data: freshRosters,
            }
          : null;
      } catch (fetchError) {
        console.error("Failed to fetch rosters:", fetchError);
        return null;
      }
    }
  }

  async getRosterByTeam(teamId) {
    try {
      const data = await this.getLatestRosters();
      if (!data) return null;

      return data.data.filter((player) => player.teamId === teamId);
    } catch (error) {
      console.error("Error getting team roster:", error);
      return null;
    }
  }

  scheduleUpdates() {
    // Run update every day at 4 AM
    return schedule.scheduleJob("0 4 * * *", async () => {
      console.log("Running scheduled roster update...");
      await this.fetchAllRosters();
    });
  }
}

module.exports = new NBADataService();
