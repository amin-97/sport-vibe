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
    // Log the raw row to see its exact structure
    console.log("Raw row:", JSON.stringify(row, null, 2));

    return {
      TeamID: row["TEAM_ID"] ? row["TEAM_ID"].toString() : "",
      ABBREVIATION: row["ABBREVIATION"] || "",
      NICKNAME: row["NICKNAME"] || "",
      YEARFOUNDED: row["YEARFOUNDED"] ? Number(row["YEARFOUNDED"]) : 0,
      CITY: row["CITY"] || "",
      ARENA: row["ARENA"] || "",
      ARENACAPACITY: row["ARENACAPACITY"] ? Number(row["ARENACAPACITY"]) : 0,
      OWNER: row["OWNER"] || "",
      GENERALMANAGER: row["GENERALMANAGER"] || "",
      HEADCOACH: row["HEADCOACH"] || "",
      DLEAGUEAFFILIATION: row["DLEAGUEAFFILIATION"] || "",
      lastUpdated: new Date(),
      dataSource: "import",
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

    await TeamDetails.deleteMany({});
    console.log("Cleared existing data");

    const result = await TeamDetails.insertMany(data, {
      ordered: false,
    });
    console.log(`Successfully imported ${result.length} records`);

    const uniqueTeamCount = new Set(data.map((row) => row.TeamID)).size;
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

    await importData(cleanedData);
    console.log("Import completed successfully");
  } catch (error) {
    console.error("Import failed:", error);
    console.error("Error details:", error.stack);
    process.exit(1);
  }
};

main();
