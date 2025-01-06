// server/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const testRoutes = require("./routes/test/s3test");

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Your Vue app's URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);

const wrestlingResultsRoutes = require("./routes/api/wrestlingResults");
app.use("/api/wrestling-results", wrestlingResultsRoutes);

const wrestlingNewsRoutes = require("./routes/api/wrestlingNews");
app.use("/api/wrestling-news", wrestlingNewsRoutes);

const wrestlingEditorialRoutes = require("./routes/api/wrestlingEditorials");
app.use("/api/wrestling-editorials", wrestlingEditorialRoutes);

// server/server.js
const nbaNewsRoutes = require("./routes/api/nbaNews");
const nbaEditorialRoutes = require("./routes/api/nbaEditorials");

app.use("/api/nba-news", nbaNewsRoutes);
app.use("/api/nba-editorials", nbaEditorialRoutes);

// server/app.js
const activePlayerStatsRoutes = require("./routes/api/activePlayerCareerStats");
app.use("/api/stats", activePlayerStatsRoutes);

const teams = require("./routes/api/teams");
app.use("/api/teams", teams);
const teamDetails = require("./routes/api/teamDetails");
app.use("/api/team-details", teamDetails);
const commonTeamRoster = require("./routes/api/commonTeamRoster");
app.use("/api/common-team-roster", commonTeamRoster);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
