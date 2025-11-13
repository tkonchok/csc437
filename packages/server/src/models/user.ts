// server/src/models/user.ts
import { Schema, model } from "mongoose";

export interface IUser {
  username: string;
  password: string;
  userType: "artist" | "curator";
  bio?: string;
  avatarSrc?: string;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ["artist", "curator"], required: true },
  bio: { type: String, default: "" },
  avatarSrc: { type: String, default: "" },
});

const User = model<IUser>("User", UserSchema);
export default User;