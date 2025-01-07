// server/scripts/importTeams.js
const XLSX = require("xlsx");
const mongoose = require("mongoose");
require("dotenv").config();
const Teams = require("../models/Teams");

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
    id: row.id.toString(),
    full_name: row.full_name,
    abbreviation: row.abbreviation,
    nickname: row.nickname,
    city: row.city,
    state: row.state,
    year_founded: Number(row.year_founded),
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
    //console.log("Connected to MongoDB");

    await Teams.deleteMany({});
    //console.log("Cleared existing data");

    const result = await Teams.insertMany(data, {
      ordered: false,
    });
    //console.log(`Successfully imported ${result.length} records`);

    const uniqueTeamCount = new Set(data.map((row) => row.id)).size;
    //console.log(`Number of unique teams: ${uniqueTeamCount}`);

    return result;
  } catch (error) {
    //console.error("Error importing data:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
    //console.log("Disconnected from MongoDB");
  }
};

const main = async () => {
  try {
    const filePath = process.argv[2] || "./Teams.xlsx";
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

main();
