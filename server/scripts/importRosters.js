// server/scripts/importCommonTeamRoster.js
const XLSX = require("xlsx");
const mongoose = require("mongoose");
require("dotenv").config();
const CommonTeamRoster = require("../models/CommonTeamRoster");

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
  return rawData.map((row) => ({
    TeamID: row.TeamID.toString(),
    SEASON: row.SEASON.toString(),
    LeagueID: row.LeagueID.toString(),
    PLAYER: row.PLAYER,
    NICKNAME: row.NICKNAME,
    PLAYER_SLUG: row.PLAYER_SLUG,
    NUM: row.NUM.toString(),
    POSITION: row.POSITION,
    HEIGHT: row.HEIGHT,
    WEIGHT: Number(row.WEIGHT),
    BIRTH_DATE: row.BIRTH_DATE,
    AGE: Number(row.AGE),
    EXP: row.EXP === "R" ? 0 : Number(row.EXP),
    SCHOOL: row.SCHOOL,
    PLAYER_ID: row.PLAYER_ID.toString(),
    HOW_ACQUIRED: row.HOW_ACQUIRED,
    lastUpdated: new Date(),
    dataSource: "import",
  }));
};

const importData = async (data) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    await CommonTeamRoster.deleteMany({});
    console.log("Cleared existing data");

    const result = await CommonTeamRoster.insertMany(data, {
      ordered: false,
    });
    console.log(`Successfully imported ${result.length} records`);

    const uniquePlayerCount = new Set(data.map((row) => row.PLAYER_ID)).size;
    console.log(`Number of unique players: ${uniquePlayerCount}`);

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
    const filePath = process.argv[2] || "./CommonTeamRoster.xlsx";
    console.log("Reading file from:", filePath);

    const rawData = readExcelFile(filePath);
    console.log(`Read ${rawData.length} rows from Excel`);

    const cleanedData = cleanData(rawData);
    console.log("Data cleaned and formatted");

    await importData(cleanedData);
    console.log("Import completed successfully");
  } catch (error) {
    console.error("Import failed:", error);
    process.exit(1);
  }
};

main();
