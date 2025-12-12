//server/src/index.ts
import express, { Request, Response } from "express";
import path from "path";
import cors from "cors";

import { connect } from "./services/mongo";
import auth, { authenticateUser } from "./routes/auth";

import profileRoutes from "./routes/profile";
import messageRoutes from "./routes/messages";
import audioPostRoutes from "./routes/audioposts";
import commentRoutes from "./routes/comments";
import audioPostREST from "./routes/audioposts_rest";

const app = express();
const port = process.env.PORT || 3000;

//static files
const staticDir = process.env.STATIC || "public";
app.use(express.static(path.join(__dirname, "../../proto/public")));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//DB
connect("tenzyn_db");

//Test
app.get("/hello", (_req: Request, res: Response) => {
  res.send("Hello, World");
});

/*AUTH*/
app.use("/auth", auth);

/*PROFILE & MESSAGES (protected at mount) */
app.use("/profile", authenticateUser, profileRoutes);
app.use("/messages", authenticateUser, messageRoutes);

/*DATA APIs
   Auth for mutations handled *inside* routers
   GETs can be public (or still use auth if route says so)
*/
app.use("/api/audioposts", audioPostRoutes);
app.use("/api/comments", commentRoutes);

app.use("/api/posts", audioPostRoutes);
app.use("/api/audioposts_rest", audioPostREST);

/*UPLOADS*/
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.listen(port, () => {
  console.log(`Dra.Wave server running on http://localhost:${port}`);
});