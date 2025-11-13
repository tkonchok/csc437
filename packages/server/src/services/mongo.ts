import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export function connect() {
  const uri = process.env.MONGO_URI || "";
  if (!uri) {
    console.error("Missing MONGO_URI in .env");
    process.exit(1);
  }
  mongoose
    .connect(uri)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));
}