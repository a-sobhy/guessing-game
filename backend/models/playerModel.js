import mongoose from "mongoose";
const playerModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    multiplier: {
      type: Number,
      default: 0,
    },
    points: {
      type: Number,
      default: 0,
    },
    gained: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const PlayerModel = mongoose.model("Player", playerModelSchema);
