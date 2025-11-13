//server/src/routes/auth.ts
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";

const router = express.Router();

//REGISTER
router.post("/register", async (req, res) => {
  const { username, password, userType } = req.body;

  if (!username || !password || !userType) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed, userType });
    await user.save();

    res.status(201).json({ message: "User created" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { username: user.username, userType: user.userType },
    process.env.JWT_SECRET || "supersecret",
    { expiresIn: "1d" }
  );

  res.json({ token });
});

export default router;