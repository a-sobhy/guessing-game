// models/gameBoardModel.js
import mongoose from "mongoose";

const GameBoardSchema = new mongoose.Schema(
  {
    multiplier: {
      type: Number,
      required: true,
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const GameBoardModel = mongoose.model("GameBoard", GameBoardSchema);
