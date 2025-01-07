// server/scripts/importPlayerStats.js
const XLSX = require("xlsx");
const mongoose = require("mongoose");
require("dotenv").config();
const ActivePlayerCareerStats = require("../models/ActivePlayerCareerStats");

// Function to read Excel file and convert to JSON
const readExcelFile = (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath, {
      cellDates: true,
      dateNF: "yyyy-mm-dd",
    });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert Excel data to JSON
    return XLSX.utils.sheet_to_json(worksheet, {
      raw: false,
      defval: null,
    });
  } catch (error) {
    console.error("Error reading Excel file:", error);
    throw error;
  }
};

// Function to clean and validate the data
const cleanData = (rawData) => {
  return rawData.map((row) => {
    // Convert string numbers to actual numbers
    const numericFields = [
      "PLAYER_ID",
      "LEAGUE_ID",
      "TEAM_ID",
      "PLAYER_AGE",
      "GP",
      "GS",
      "MIN",
      "FGM",
      "FGA",
      "FG_PCT",
      "FG3M",
      "FG3A",
      "FG3_PCT",
      "FTM",
      "FTA",
      "FT_PCT",
      "OREB",
      "DREB",
      "REB",
      "AST",
      "STL",
      "BLK",
      "TOV",
      "PF",
      "PTS",
    ];

    const cleanedRow = { ...row };
    numericFields.forEach((field) => {
      if (cleanedRow[field] !== null && cleanedRow[field] !== undefined) {
        cleanedRow[field] = Number(cleanedRow[field]);
      }
    });

    return {
      ...cleanedRow,
      lastUpdated: new Date(),
      dataSource: "import",
    };
  });
};

// Function to import data to MongoDB
const importData = async (data) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    //console.log("Connected to MongoDB");

    // Clear existing data if needed
    // await ActivePlayerCareerStats.deleteMany({});
    // console.log('Cleared existing data');

    // Insert the data
    const result = await ActivePlayerCareerStats.insertMany(data, {
      ordered: false, // Continue inserting even if some documents fail
    });
    //console.log(`Successfully imported ${result.length} records`);

    // Log any potential issues with the data
    const uniquePlayerCount = new Set(data.map((row) => row.PLAYER_ID)).size;
    //console.log(`Number of unique players: ${uniquePlayerCount}`);

    return result;
  } catch (error) {
    console.error("Error importing data:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
    //console.log("Disconnected from MongoDB");
  }
};

// Main execution function
const main = async () => {
  try {
    // Update this path to your Excel file location
    const filePath = process.argv[2] || "./active_player_career_stats.xlsx";
    //console.log("Reading file from:", filePath);

    const rawData = readExcelFile(filePath);
    //console.log(`Read ${rawData.length} rows from Excel`);

    const cleanedData = cleanData(rawData);
    //console.log("Data cleaned and formatted");

    await importData(cleanedData);
    //console.log("Import completed successfully");
  } catch (error) {
    //console.error("Import failed:", error);
    process.exit(1);
  }
};

// Run the script
main();
