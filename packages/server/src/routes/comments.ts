// server/src/routes/comments.ts
import express, { Request, Response } from "express";
import Comments from "../services/comment-svc";
import { authenticateUser } from "./auth";

const router = express.Router();

/* -----------------------------
   GET all comments for a post
   /api/comments/:postId
------------------------------ */
router.get("/:postId", async (req: Request, res: Response) => {
  try {
    const comments = await Comments.forPost(req.params.postId);
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load comments" });
  }
});

/* -----------------------------
   CREATE a comment (AUTH REQUIRED)
   /api/comments/:postId
------------------------------ */
router.post("/:postId", authenticateUser, async (req: Request, res: Response) => {
  try {
    const username = (req as any).user?.username;
    if (!username) return res.status(401).json({ error: "Unauthorized" });

    const newComment = await Comments.create({
      postId: req.params.postId,
      text: req.body.text,
      user: username
    });

    res.status(201).json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create comment" });
  }
});

/*UPDATE comment (AUTH REQUIRED)
   /api/comments/:commentId*/
router.put("/:commentId", authenticateUser, async (req: Request, res: Response) => {
  try {
    const updated = await Comments.update(req.params.commentId, {
      text: req.body.text
    });

    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update comment" });
  }
});

/*DELETE comment (AUTH REQUIRED)
   /api/comments/:commentId*/
router.delete("/:commentId", authenticateUser, async (req: Request, res: Response) => {
  try {
    const removed = await Comments.remove(req.params.commentId);
    if (!removed) return res.status(404).json({ error: "Not found" });

    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

export default router;