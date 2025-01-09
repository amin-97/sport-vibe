const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Import models for DB check
const ActivePlayerCareerStats = require("./models/ActivePlayerCareerStats");
const Teams = require("./models/Teams");
const TeamDetails = require("./models/TeamDetails");
const CommonTeamRoster = require("./models/CommonTeamRoster");

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL
        : "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json());

// Database initialization function
const initializeDatabase = async () => {
  try {
    console.log("Checking if database needs initialization...");

    // Check if any data exists
    const statsCount = await ActivePlayerCareerStats.countDocuments();
    const teamsCount = await Teams.countDocuments();
    const teamDetailsCount = await TeamDetails.countDocuments();
    const rosterCount = await CommonTeamRoster.countDocuments();

    if (
      statsCount === 0 ||
      teamsCount === 0 ||
      teamDetailsCount === 0 ||
      rosterCount === 0
    ) {
      console.log("Database is empty. Starting initialization...");

      // Import your initialization scripts
      const importPlayerStats = require("./scripts/importPlayerStats");
      const importTeams = require("./scripts/importTeams");
      const importTeamDetails = require("./scripts/importTeamDetails");
      const importCommonTeamRoster = require("./scripts/importCommonTeamRoster");

      // Define data directory path
      const dataDir = path.join(__dirname, "data");

      // Run imports
      await importPlayerStats(`${dataDir}/active_player_career_stats.xlsx`);
      await importTeams(`${dataDir}/Teams.xlsx`);
      await importTeamDetails(`${dataDir}/TeamDetails.xlsx`);
      await importCommonTeamRoster(`${dataDir}/CommonTeamRoster.xlsx`);

      console.log("Database initialization completed successfully");
    } else {
      console.log("Database already contains data. Skipping initialization.");
    }
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
};

// MongoDB Connection with initialization
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
    await initializeDatabase();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
// app.use("/api/test", testRoutes);

const wrestlingResultsRoutes = require("./routes/api/wrestlingResults");
app.use("/api/wrestling-results", wrestlingResultsRoutes);

const wrestlingNewsRoutes = require("./routes/api/wrestlingNews");
app.use("/api/wrestling-news", wrestlingNewsRoutes);

const wrestlingEditorialRoutes = require("./routes/api/wrestlingEditorials");
app.use("/api/wrestling-editorials", wrestlingEditorialRoutes);

const nbaNewsRoutes = require("./routes/api/nbaNews");
const nbaEditorialRoutes = require("./routes/api/nbaEditorials");

app.use("/api/nba-news", nbaNewsRoutes);
app.use("/api/nba-editorials", nbaEditorialRoutes);

const activePlayerStatsRoutes = require("./routes/api/activePlayerCareerStats");
app.use("/api/stats", activePlayerStatsRoutes);

const teams = require("./routes/api/teams");
app.use("/api/teams", teams);
const teamDetails = require("./routes/api/teamDetails");
app.use("/api/team-details", teamDetails);
const commonTeamRoster = require("./routes/api/commonTeamRoster");
app.use("/api/common-team-roster", commonTeamRoster);

const trades = require("./routes/api/trades");
app.use("/api/trades", trades);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  // Serve static files from the Vue app build directory
  app.use(express.static(path.join(__dirname, "../client/dist")));

  // Handle any requests that don't match the above
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

// Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: "Something went wrong!" });
// });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
