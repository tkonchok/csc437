// server/src/routes/audioposts_rest.ts
import express, { Request, Response } from "express";
import { AudioPost } from "../models/audiopost";
import AudioPosts from "../services/audio-svc";

const router = express.Router();

/*GET (Collection)*/
//GET /api/audioposts_rest
router.get("/", (_: Request, res: Response) => {
  AudioPosts.index()
    .then(list => res.json(list))
    .catch(err => res.status(500).send(err));
});

/*GET (Resource)*/
// GET /api/audioposts_rest/:id
router.get("/:id", (req: Request, res: Response) => {
  AudioPosts.get(req.params.id)
    .then(item => {
      if (!item) return res.status(404).send("Not Found");
      res.json(item);
    })
    .catch(err => res.status(500).send(err));
});

/*POST*/
// POST /api/audioposts_rest
router.post("/", (req: Request, res: Response) => {
  const json = req.body as AudioPost;

  AudioPosts.create(json)
    .then(created => res.status(201).json(created))
    .catch(err => res.status(500).send(err));
});

/*PUT*/
// PUT /api/audioposts_rest/:id
router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body as AudioPost;

  AudioPosts.update(id, updateData)
    .then(updated => {
      if (!updated) return res.status(404).send("Not Found");
      res.json(updated);
    })
    .catch(() => res.status(404).send("Not Found"));
});

/*DELETE*/
// DELETE /api/audioposts_rest/:id
router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  AudioPosts.remove(id)
    .then(() => res.status(204).end())
    .catch(err => res.status(404).send(err));
});

export default router;