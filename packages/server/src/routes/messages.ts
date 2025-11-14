//server/src/routes/messages.ts
import express, { Response } from "express";
import Message from "../models/Message";
import AudioPosts from "../services/audio-svc";
import { AuthRequest } from "./auth";

const router = express.Router();

/* GET all conversations for logged-in user
   /messages*/
router.get("/", async (req: AuthRequest, res: Response) => {
  const username = req.user?.username;
  if (!username) return res.status(401).json({ message: "Unauthorized" });

  const msgs = await Message.find({
    $or: [{ from: username }, { to: username }]
  }).sort({ timestamp: 1 });

  res.json(msgs);
});

/*SEND a direct message
   /messages/send*/
router.post("/send", async (req: AuthRequest, res: Response) => {
  const from = req.user?.username;
  const { to, text } = req.body;

  if (!from) return res.status(401).json({ message: "Unauthorized" });
  if (!to || !text) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const msg = await Message.create({ from, to, text });
  res.json(msg);
});

/*COLLAB request (FROM logged-in user)
   /messages/collab/:postId*/
router.post("/collab/:postId", async (req: AuthRequest, res: Response) => {
  const from = req.user?.username;
  const { postId } = req.params;

  if (!from) return res.status(401).json({ message: "Unauthorized" });

  const post = await AudioPosts.get(postId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const to = (post as any).artist;
  const messageText = `${from} wants to collaborate with you on "${post.title}".`;

  const msg = await Message.create({
    from,
    to,
    text: messageText
  });

  res.json(msg);
});

export default router;