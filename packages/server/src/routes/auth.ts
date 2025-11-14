// server/src/routes/auth.ts
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import credentials from "../services/credential-svc";
import User from "../models/user";

dotenv.config();

const router = express.Router();

const TOKEN_SECRET: string = process.env.TOKEN_SECRET || "NOT_A_SECRET";

interface TokenPayload {
  username: string;
}

export interface AuthUser {
  username: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

/*JWT helper*/

function generateAccessToken(username: string): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username },
      TOKEN_SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error || !token) reject(error);
        else resolve(token as string);
      }
    );
  });
}

/*REGISTER*/
// POST /auth/register
router.post("/register", (req: Request, res: Response) => {
  const { username, password, userType } = req.body;

  if (typeof username !== "string" || typeof password !== "string") {
    return res
      .status(400)
      .send("Bad request: Invalid input data.");
  }

  //fallback so your profile still works if userType is missing
  const finalUserType = (userType === "artist" || userType === "curator")
    ? userType
    : "artist";

  credentials
    .create(username, password)
    //create/update profile document as well
    .then(() =>
      User.findOneAndUpdate(
        { username },
        {
          username,
          userType: finalUserType
        },
        { upsert: true, new: true }
      )
    )
    .then(() => generateAccessToken(username))
    .then((token) => {
      res.status(201).send({ token });
    })
    .catch((err: any) => {
      console.error(err);
      res.status(409).send({ error: err.message || String(err) });
    });
});

/*LOGIN*/
// POST /auth/login
router.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .send("Bad request: Invalid input data.");
  }

  credentials
    .verify(username, password)
    .then((goodUser: string) => generateAccessToken(goodUser))
    .then((token) => res.status(200).send({ token }))
    .catch((_error) => res.status(401).send("Unauthorized"));
});

/*AUTH MIDDLEWARE*/
export function authenticateUser(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).end();
  }

  jwt.verify(token, TOKEN_SECRET, (error, decoded) => {
    if (decoded && !error) {
      const payload = decoded as TokenPayload;
      req.user = { username: payload.username };
      next();
    } else {
      res.status(401).end();
    }
  });
}

export default router;