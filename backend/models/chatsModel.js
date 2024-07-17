import mongoose from "mongoose";
const chatsSchema = mongoose.Schema(
  {
    user: String,
    message: String,
  },
  {
    timestamp: true,
  }
);
export const chat = mongoose.model("Chat", chatsSchema);
