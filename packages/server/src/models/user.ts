// server/src/models/user.ts
import { Schema, model } from "mongoose";

export interface IUser {
  username: string;
  userType: "artist" | "curator";
  bio?: string;
  avatarSrc?: string;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    userType: { type: String, enum: ["artist", "curator"], required: true },
    bio: { type: String, default: "" },
    avatarSrc: { type: String, default: "" }
  },
  { collection: "dra_users" }
);

export default model<IUser>("User", UserSchema);