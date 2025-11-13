//server/src/routes/profile.ts
import express from "express";
import path from "path";
import multer from "multer";
import User from "../models/user";
import AudioPosts from "../services/audio-svc";
import { authenticate, AuthRequest } from "../middleware/authenticate";

const router = express.Router();

//avatar storage
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "uploads/"),
  filename: (_, file, cb) => {
    const unique = `avatar-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, unique);
  },
});
const upload = multer({ storage });

//get current user profile
router.get("/me", authenticate, async (req: AuthRequest, res) => {
  try {
    const username = req.user!.username;
    const user = await User.findOne({ username }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

//update bio
router.put("/me", authenticate, async (req: AuthRequest, res) => {
  try {
    const username = req.user!.username;
    const { bio } = req.body;

    const updated = await User.findOneAndUpdate(
      { username },
      { bio },
      { new: true }
    ).select("-password");

    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

//upload / change avatar
router.post(
  "/me/avatar",
  authenticate,
  upload.single("avatar"),
  async (req: AuthRequest, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: "No file uploaded" });

      const username = req.user!.username;
      const avatarSrc = `/uploads/${req.file.filename}`;

      const updated = await User.findOneAndUpdate(
        { username },
        { avatarSrc },
        { new: true }
      ).select("-password");

      if (!updated) return res.status(404).json({ message: "User not found" });

      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
);

//get posts by logged-in user
router.get("/me/posts", authenticate, async (req: AuthRequest, res) => {
  try {
    const username = req.user!.username;
    const posts = await AudioPosts.byArtist(username);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

export default router;