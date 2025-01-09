// server/models/Trade.js
const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema(
  {
    teams: [
      {
        type: String,
        required: true,
      },
    ],
    tradedPlayers: {
      type: Map,
      of: [
        {
          PLAYER_ID: String,
          PLAYER: String,
          TeamID: String,
          NUM: String,
          POSITION: String,
        },
      ],
      required: true,
    },
    tradedPicks: {
      type: Map,
      of: [
        {
          id: String,
          year: Number,
          round: String,
          protection: String,
        },
      ],
    },
    executedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Trade", tradeSchema);
