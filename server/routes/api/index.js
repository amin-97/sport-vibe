// server/routes/api/index.js
const express = require("express");
const router = express.Router();

router.use("/wrestling-results", require("./wrestlingResults"));
router.use("/wrestling-news", require("./wrestlingNews"));
router.use("/wrestling-editorials", require("./wrestlingEditorials"));

module.exports = router;
