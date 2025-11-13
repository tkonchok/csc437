import express from "express";
import multer from "multer";
import path from "path";
import AudioPosts from "../services/audio-svc";
import { authenticate, AuthRequest } from "../middleware/authenticate";

const router = express.Router();

//storage
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "uploads/"),
  filename: (_, file, cb) => {
    const uniqueName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const artist = req.query.artist as string | undefined;
    const posts = artist
      ? await AudioPosts.byArtist(artist)
      : await AudioPosts.index();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

//GET SINGLE POST BY ID
router.get("/:id", async (req, res) => {
  try {
    const p = await AudioPosts.get(req.params.id);
    if (!p) return res.status(404).json({ error: "Post not found" });
    res.json(p);
  } catch (err) {
    res.status(500).json({ error: "Error loading post" });
  }
});

//UPLOAD POST (AUTH REQUIRED)
router.post(
  "/",
  authenticate,
  upload.fields([{ name: "image" }, { name: "audio" }]),
  async (req: AuthRequest, res) => {
    try {
      const username = req.user?.username!;
      const { title, genre, artist } = req.body;

      const imgFile = (req.files as any)?.image?.[0];
      const audioFile = (req.files as any)?.audio?.[0];

      const imgSrc = imgFile ? `/uploads/${imgFile.filename}` : "";
      const audioSrc = audioFile ? `/uploads/${audioFile.filename}` : "";

      const post = await AudioPosts.create({
        title,
        genre,
        artist,
        imgSrc,
        audioSrc,
        user: username,
      });

      res.status(201).json(post);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err });
    }
  }
);

export default router;