// server/scripts/importTeamDetails.js
const XLSX = require("xlsx");
const mongoose = require("mongoose");
require("dotenv").config();
const TeamDetails = require("../models/TeamDetails");

const readExcelFile = (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath, {
      cellDates: true,
      dateNF: "yyyy-mm-dd",
    });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    return XLSX.utils.sheet_to_json(worksheet, {
      raw: false,
      defval: null,
    });
  } catch (error) {
    console.error("Error reading Excel file:", error);
    throw error;
  }
};

const cleanData = (rawData) => {
  return rawData.map((row) => {
    // Convert scientific notation to string for TEAM_ID
    const teamId = row["TEAM_ID"]
      ? typeof row["TEAM_ID"] === "number"
        ? row["TEAM_ID"].toFixed(0)
        : row["TEAM_ID"]
      : "";

    return {
      TEAM_ID: teamId,
      ABBREVIATION: (row["ABBREVIATION"] || "").trim().toUpperCase(),
      NICKNAME: (row["NICKNAME"] || "").trim(),
      YEARFOUNDED: row["YEARFOUNDED"] ? Number(row["YEARFOUNDED"]) : 0,
      CITY: (row["CITY"] || "").trim(),
      ARENA: (row["ARENA"] || "").trim(),
      ARENACAPACITY: row["ARENACAPACITY"] ? Number(row["ARENACAPACITY"]) : 0,
      OWNER: (row["OWNER"] || "").trim(),
      GENERALMANAGER: (row["GENERALMANAGER"] || "").trim(),
      HEADCOACH: (row["HEADCOACH"] || "").trim(),
      DLEAGUEAFFILIATION: (row["DLEAGUEAFFILIATION"] || "").trim() || null,
    };
  });
};

const importData = async (data) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Optional: Validate data before import
    const validationErrors = data.filter((team) => {
      // Add more validation as needed
      return !team.TEAM_ID || !team.ABBREVIATION || !team.NICKNAME;
    });

    if (validationErrors.length > 0) {
      console.error("Validation Errors:", validationErrors);
      throw new Error(`${validationErrors.length} teams failed validation`);
    }

    await TeamDetails.deleteMany({});
    console.log("Cleared existing data");

    const result = await TeamDetails.insertMany(data, {
      ordered: false,
    });
    console.log(`Successfully imported ${result.length} records`);

    const uniqueTeamCount = new Set(data.map((row) => row.TEAM_ID)).size;
    console.log(`Number of unique team details: ${uniqueTeamCount}`);

    return result;
  } catch (error) {
    console.error("Error importing data:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

const main = async () => {
  try {
    const filePath = process.argv[2] || "./TeamDetails.xlsx";
    console.log("Reading file from:", filePath);

    const rawData = readExcelFile(filePath);
    console.log(`Read ${rawData.length} rows from Excel`);

    const cleanedData = cleanData(rawData);
    console.log("Data cleaned and formatted");

    // Log first few entries to verify
    console.log(
      "First 3 entries:",
      JSON.stringify(cleanedData.slice(0, 3), null, 2)
    );

    await importData(cleanedData);
    console.log("Import completed successfully");
  } catch (error) {
    console.error("Import failed:", error);
    console.error("Error details:", error.stack);
    process.exit(1);
  }
};

main();
