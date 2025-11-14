import express from "express";
import path from "path";
import multer from "multer";

import User from "../models/user";
import AudioPosts from "../services/audio-svc";
import { authenticateUser } from "./auth";

const router = express.Router();

/*Multer storage (uploads/)*/
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "uploads/"),
  filename: (_, file, cb) => {
    const unique = `avatar-${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, unique);
  }
});
const upload = multer({ storage });

/*GET /profile/me  (auth required)*/
router.get("/me", authenticateUser, async (req, res) => {
  try {
    const username = (req as any).user.username;

    const user = await User.findOne({ username }).select("-hashedPassword");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

/*PUT /profile/me  (update bio)*/
router.put("/me", authenticateUser, async (req, res) => {
  try {
    const username = (req as any).user.username;
    const { bio } = req.body;

    const updated = await User.findOneAndUpdate(
      { username },
      { bio },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "User not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

/*POST /profile/me/avatar  (upload avatar)*/
router.post(
  "/me/avatar",
  authenticateUser,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ message: "No file uploaded" });

      const username = (req as any).user.username;
      const avatarSrc = `/uploads/${req.file.filename}`;

      const updated = await User.findOneAndUpdate(
        { username },
        { avatarSrc },
        { new: true }
      );

      if (!updated) return res.status(404).json({ message: "User not found" });

      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
);

/*GET /profile/me/posts*/
router.get("/me/posts", authenticateUser, async (req, res) => {
  try {
    const username = (req as any).user.username;

    const posts = await AudioPosts.byArtist(username);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

export default router;