// server/routes/api/index.js
const express = require("express");
const router = express.Router();

router.use("/wrestling-results", require("./wrestlingResults"));
router.use("/news", require("./news"));
router.use("/editorials", require("./editorials"));

module.exports = router;
