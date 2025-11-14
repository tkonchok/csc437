import { Schema, model } from "mongoose";

export interface IComment {
  postId: string;
  user: string;
  text: string;
  created?: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    postId: { type: String, required: true },
    user: { type: String, required: true },
    text: { type: String, required: true },
    created: { type: Date, default: Date.now }
  },
  { collection: "dra_comments" }
);

export default model<IComment>("Comment", CommentSchema);