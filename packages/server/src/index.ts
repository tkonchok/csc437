//server/src/index.ts
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";

import postRoutes from "./routes/posts";
import commentRoutes from "./routes/comments";
import messageRoutes from "./routes/messages";


import auth from "./routes/auth";
import posts from "./routes/posts";
import profile from "./routes/profile";
import messages from "./routes/messages";



const app = express();
const port = 3000;

//Mongo connection
mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection failed:", err));

//Middleware
app.use(cors());
app.use(express.json());

app.use(cors());
app.use(express.json());

app.use("/public", express.static("../proto/public"));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

//Routes
app.use("/auth", auth);
app.use("/api/posts", posts);
app.use("/profile", profile);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/messages", messageRoutes);
app.use("/messages", messages);


//Start server
app.listen(port, () => {
  console.log(`Dra.Wave running on http://localhost:${port}`);
});