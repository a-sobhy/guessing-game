import mongoose from "mongoose";
const gameBoardModelSchema = new mongoose.Schema({
  multiplier: {
    type: Number,
    required: true,
  },
  isRunning: {
    type: Boolean,
  },
});

export const GameBoardModel = mongoose.model("Game", gameBoardModelSchema);
