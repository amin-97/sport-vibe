// server/routes/api/trades.js
const express = require("express");
const router = express.Router();
const tradesController = require("../../controllers/tradesController");
const { verifyToken } = require("../../middleware/auth");

router.post("/execute", verifyToken, tradesController.executeTrade);
router.get("/history", verifyToken, tradesController.getTradeHistory);
router.get("/:id", verifyToken, tradesController.getTradeById);

module.exports = router;
