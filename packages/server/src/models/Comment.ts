import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  postId: { type: String, required: true },
  user: { type: String, required: true },
  text: { type: String, required: true },
  created: { type: Date, default: Date.now }
});

export default mongoose.model("Comment", CommentSchema);