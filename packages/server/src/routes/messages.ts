import express from "express";
import Message from "../models/Message";
import AudioPosts from "../services/audio-svc";
import { authenticate, AuthRequest } from "../middleware/authenticate";

const router = express.Router();

//all conversations for logged-in user
router.get("/", authenticate, async (req: AuthRequest, res) => {
  const username = req.user!.username;
  const msgs = await Message.find({
    $or: [{ from: username }, { to: username }]
  }).sort({ timestamp: 1 });

  res.json(msgs);
});

//send a direct message
router.post("/send", authenticate, async (req: AuthRequest, res) => {
  const from = req.user!.username;
  const { to, text } = req.body;

  if (!to || !text) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const msg = await Message.create({ from, to, text });
  res.json(msg);
});

//Collaboration request (FROM post owner)
router.post("/collab/:postId", authenticate, async (req: AuthRequest, res) => {
  const from = req.user!.username;
  const { postId } = req.params;

  const post = await AudioPosts.get(postId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const to = post.artist; //send message to artist

  const messageText = `${from} wants to collaborate with you on "${post.title}".`;

  const msg = await Message.create({
    from,
    to,
    text: messageText,
  });

  res.json(msg);
});

export default router;