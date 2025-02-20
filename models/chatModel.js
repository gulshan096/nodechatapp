import mongoose from "mongoose";

const chatSchema = mongoose.Schema(
  {
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Chat", chatSchema);
