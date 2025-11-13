import express from "express";
import Comment from "../models/Comment";
import { authenticate, AuthRequest } from "../middleware/authenticate";

const router = express.Router();

//GET comments for a post
router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Failed to load comments" });
  }
});

//POST a new comment
router.post("/:postId", authenticate, async (req: AuthRequest, res) => {
  try {
    const text = req.body.text;
    const user = req.user?.username;

    if (!text) return res.status(400).json({ error: "Empty comment" });

    const c = await Comment.create({
      postId: req.params.postId,
      user,
      text
    });

    res.status(201).json(c);

  } catch (err) {
    res.status(500).json({ error: "Failed to save comment" });
  }
});

export default router;