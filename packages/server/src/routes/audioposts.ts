// server/src/routes/audioposts.ts
import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import AudioPosts from "../services/audio-svc";
import { authenticateUser } from "./auth";
import { AudioPost } from "../models/audiopost";

const router = express.Router();

/*Multer storage for uploads*/
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/"),
  filename: (_req, file, cb) => {
    const uniqueName = `${file.fieldname}-${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

/* GET all posts (optionally by artist)
   /api/posts
   /api/posts?artist=username*/
router.get("/", async (req: Request, res: Response) => {
  try {
    const artist = req.query.artist as string | undefined;
    const posts = artist
      ? await AudioPosts.byArtist(artist)
      : await AudioPosts.index();
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load posts" });
  }
});

/*
   GET single post
   /api/posts/:id */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const post = await AudioPosts.get(req.params.id);
    if (!post) return res.status(404).json({ error: "Not found" });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching post" });
  }
});

/*CREATE post (AUTH REQUIRED)
      Handles multipart upload (image + audio)
      works with JSON body that includes imgSrc/audioSrc*/
router.post(
  "/",
  authenticateUser,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 }
  ]),
  async (req: Request, res: Response) => {
    try {
      const username = (req as any).user?.username;
      if (!username) return res.status(401).json({ error: "Unauthorized" });

      const { title, genre, artist } = req.body;

      const files = req.files as {
        [field: string]: Express.Multer.File[];
      } | undefined;

      const imgFile = files?.image?.[0];
      const audioFile = files?.audio?.[0];

      //if files uploaded, use /uploads/...; otherwise fall back to any imgSrc/audioSrc in body
      const imgSrc = imgFile
        ? `/uploads/${imgFile.filename}`
        : (req.body.imgSrc || "");

      const audioSrc = audioFile
        ? `/uploads/${audioFile.filename}`
        : (req.body.audioSrc || "");

      const newPost = await AudioPosts.create({
        title,
        genre,
        artist,
        imgSrc,
        audioSrc,
        user: username
      } as AudioPost & { user?: string });

      res.status(201).json(newPost);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create post" });
    }
  }
);

/*UPDATE post (AUTH REQUIRED)*/
router.put("/:id", authenticateUser, async (req: Request, res: Response) => {
  try {
    const updated = await AudioPosts.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update post" });
  }
});

/*DELETE post (AUTH REQUIRED)*/
router.delete("/:id", authenticateUser, async (req: Request, res: Response) => {
  try {
    const deleted = await AudioPosts.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });

    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

export default router;